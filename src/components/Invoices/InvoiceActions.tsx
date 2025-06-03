
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Download, Share, Mail, Printer, Eye, Edit } from 'lucide-react';
import { Invoice, Client } from '@/types';
import { downloadInvoicePDF, shareInvoice, printInvoice } from '@/utils/invoiceUtils';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface InvoiceActionsProps {
  invoice: Invoice;
  client: Client;
  onEdit: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
}

const InvoiceActions = ({ invoice, client, onEdit, onView }: InvoiceActionsProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      await downloadInvoicePDF(`invoice-${invoice.id}`, `${invoice.invoiceNumber}.pdf`);
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
      await shareInvoice(`invoice-${invoice.id}`, `Invoice ${invoice.invoiceNumber}`);
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share invoice. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEmailInvoice = async () => {
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

  const handlePrint = () => {
    printInvoice();
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onView(invoice)}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(invoice)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEmailInvoice}>
            <Mail className="h-4 w-4 mr-2" />
            Email to Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InvoiceActions;
