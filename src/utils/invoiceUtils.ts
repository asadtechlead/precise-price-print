
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateInvoicePDF = async (elementId: string, filename: string = 'invoice.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf;
};

export const downloadInvoicePDF = async (elementId: string, filename: string = 'invoice.pdf') => {
  const pdf = await generateInvoicePDF(elementId, filename);
  pdf.save(filename);
};

export const shareInvoice = async (elementId: string, title: string = 'Invoice') => {
  if (navigator.share) {
    const pdf = await generateInvoicePDF(elementId);
    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], 'invoice.pdf', { type: 'application/pdf' });
    
    try {
      await navigator.share({
        title,
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to download
      downloadInvoicePDF(elementId);
    }
  } else {
    // Fallback for browsers without Web Share API
    downloadInvoicePDF(elementId);
  }
};

export const printInvoice = () => {
  window.print();
};
