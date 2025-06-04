
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle }  from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share, Mail, Printer } from 'lucide-react';
import { Invoice, Client, InvoiceItem } from '@/types';
import { downloadInvoicePDF, shareInvoice, printInvoice } from '@/utils/invoiceUtils';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface InvoiceViewProps {
  invoice: Invoice;
  client: Client;
  onBack: () => void;
  currency: { symbol: string };
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, client, onBack, currency }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const formatCurrency = (amount: number) => `${currency.symbol}${amount.toLocaleString()}`;
  
  const getItemName = (item: InvoiceItem): string => {
    return item.description || 'Unknown Item';
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      await downloadInvoicePDF(`invoice-content-${invoice.id}`, `Invoice-${invoice.invoiceNumber}.pdf`);
      toast({
        title: "PDF Downloaded",
        description: "Invoice has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      await shareInvoice(`invoice-content-${invoice.id}`, `Invoice ${invoice.invoiceNumber}`);
      toast({
        title: "Share Successful",
        description: "Invoice has been shared.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share invoice. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handlePrint = () => {
    try {
      printInvoice(`invoice-content-${invoice.id}`);
    } catch (error) {
      toast({
        title: "Print Failed",
        description: "Failed to print invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await dataService.sendInvoiceEmail(invoice.id, client.email, user.id);
      toast({
        title: "Email Sent",
        description: `Invoice sent to ${client.email} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            onClick={handleDownloadPDF} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button 
            onClick={handleSendEmail} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            size="sm"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
      
      <Card>
        <div id={`invoice-content-${invoice.id}`} className="p-6 bg-white">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <p className="text-gray-600">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Status: <span className={`px-2 py-1 rounded text-xs uppercase 
                ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' : 
                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'}`}>
                {invoice.status}
              </span></p>
              <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div>
              <h3 className="font-bold mb-1">From:</h3>
              <p>Your Company Name</p>
              <p>Your Address</p>
              <p>Your Email</p>
              <p>Your Phone</p>
            </div>
            <div className="mt-4 md:mt-0">
              <h3 className="font-bold mb-1">To:</h3>
              <p>{client.name}</p>
              <p>{client.address}</p>
              {client.city && <p>{client.city}, {client.state} {client.zip}</p>}
              <p>{client.email}</p>
              {client.phone && <p>{client.phone}</p>}
            </div>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200 mb-8">
            <thead>
              <tr>
                <th className="py-3 text-left font-bold">Item</th>
                <th className="py-3 text-right font-bold">Quantity</th>
                <th className="py-3 text-right font-bold">Rate</th>
                <th className="py-3 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-3">{getItemName(item)}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.rate)}</td>
                  <td className="py-3 text-right">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-3 text-right font-bold">Subtotal</td>
                <td className="py-3 text-right">{formatCurrency(invoice.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-3 text-right font-bold">Tax ({invoice.taxRate}%)</td>
                <td className="py-3 text-right">{formatCurrency(invoice.taxAmount)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-3 text-right font-bold">Total</td>
                <td className="py-3 text-right font-bold">{formatCurrency(invoice.total)}</td>
              </tr>
            </tfoot>
          </table>
          
          {invoice.notes && (
            <div className="mb-4">
              <h3 className="font-bold mb-1">Notes:</h3>
              <p className="text-gray-700">{invoice.notes}</p>
            </div>
          )}
          
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceView;
