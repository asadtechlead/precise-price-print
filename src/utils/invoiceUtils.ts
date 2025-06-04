
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
    backgroundColor: '#ffffff',
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
  try {
    const pdf = await generateInvoicePDF(elementId, filename);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const shareInvoice = async (elementId: string, title: string = 'Invoice') => {
  try {
    if (navigator.share) {
      const pdf = await generateInvoicePDF(elementId);
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], 'invoice.pdf', { type: 'application/pdf' });
      
      await navigator.share({
        title,
        files: [file],
      });
    } else {
      // Fallback to download
      await downloadInvoicePDF(elementId);
    }
  } catch (error) {
    console.error('Error sharing:', error);
    // Fallback to download
    await downloadInvoicePDF(elementId);
  }
};

export const printInvoice = (elementId?: string) => {
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${element.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  } else {
    window.print();
  }
};
