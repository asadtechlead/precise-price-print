import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Printer, Download, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import CompanyForm from '@/components/CompanyForm';
import CustomerForm from '@/components/CustomerForm';
import InvoiceSettings from '@/components/InvoiceSettings';
import InvoicePreview from '@/components/InvoicePreview';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

interface CustomerInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const STORAGE_KEYS = {
  COMPANY_INFO: 'invoicepro_company_info',
  CUSTOMER_INFO: 'invoicepro_customer_info',
  INVOICE_SETTINGS: 'invoicepro_invoice_settings',
  LINE_ITEMS: 'invoicepro_line_items'
};

const Index = () => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate] = useState(new Date().toLocaleDateString());
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // Default to PKR
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: ''
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: ''
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem(STORAGE_KEYS.COMPANY_INFO);
    const savedCustomerInfo = localStorage.getItem(STORAGE_KEYS.CUSTOMER_INFO);
    const savedInvoiceSettings = localStorage.getItem(STORAGE_KEYS.INVOICE_SETTINGS);
    const savedLineItems = localStorage.getItem(STORAGE_KEYS.LINE_ITEMS);

    if (savedCompanyInfo) {
      setCompanyInfo(JSON.parse(savedCompanyInfo));
    }
    if (savedCustomerInfo) {
      setCustomerInfo(JSON.parse(savedCustomerInfo));
    }
    if (savedInvoiceSettings) {
      const settings = JSON.parse(savedInvoiceSettings);
      setDueDate(settings.dueDate || '');
      setTaxRate(settings.taxRate || 0);
      setNotes(settings.notes || '');
      if (settings.currency) {
        const savedCurrency = CURRENCIES.find(c => c.code === settings.currency.code);
        if (savedCurrency) {
          setCurrency(savedCurrency);
        }
      }
    }
    if (savedLineItems) {
      setLineItems(JSON.parse(savedLineItems));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_INFO, JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_INFO, JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICE_SETTINGS, JSON.stringify({
      dueDate,
      taxRate,
      notes,
      currency
    }));
  }, [dueDate, taxRate, notes, currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LINE_ITEMS, JSON.stringify(lineItems));
  }, [lineItems]);

  const clearCompanyInfo = () => {
    setCompanyInfo({
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    });
    toast({
      title: "Company information cleared",
      description: "All company fields have been reset.",
    });
  };

  const clearCustomerInfo = () => {
    setCustomerInfo({
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      email: ''
    });
    toast({
      title: "Customer information cleared",
      description: "All customer fields have been reset.",
    });
  };

  const clearInvoiceSettings = () => {
    setDueDate('');
    setTaxRate(0);
    setNotes('');
    setCurrency(CURRENCIES[0]);
    toast({
      title: "Invoice settings cleared",
      description: "Due date, tax rate, currency, and notes have been reset.",
    });
  };

  const clearLineItems = () => {
    setLineItems([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
    toast({
      title: "Line items cleared",
      description: "All line items have been reset.",
    });
  };

  const clearAll = () => {
    clearCompanyInfo();
    clearCustomerInfo();
    clearInvoiceSettings();
    clearLineItems();
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    toast({
      title: "All data cleared",
      description: "Invoice has been completely reset with a new invoice number.",
    });
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: string, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print dialog opened",
      description: "Select your printer to print the invoice.",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Use your browser's print function and select 'Save as PDF' for PDF download.",
    });
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">InvoicePro</h1>
            </div>
            <div className="flex space-x-3">
              <Button onClick={clearAll} variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownloadPDF} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Form Inputs */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            <CompanyForm 
              companyInfo={companyInfo}
              setCompanyInfo={setCompanyInfo}
              clearCompanyInfo={clearCompanyInfo}
            />

            <CustomerForm 
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              clearCustomerInfo={clearCustomerInfo}
            />

            <InvoiceSettings 
              currency={currency}
              setCurrency={setCurrency}
              dueDate={dueDate}
              setDueDate={setDueDate}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              notes={notes}
              setNotes={setNotes}
              clearInvoiceSettings={clearInvoiceSettings}
              currencies={CURRENCIES}
            />
          </div>

          {/* Right Panel - Invoice Preview */}
          <div className="lg:col-span-2">
            <InvoicePreview 
              invoiceNumber={invoiceNumber}
              invoiceDate={invoiceDate}
              dueDate={dueDate}
              companyInfo={companyInfo}
              customerInfo={customerInfo}
              lineItems={lineItems}
              addLineItem={addLineItem}
              removeLineItem={removeLineItem}
              updateLineItem={updateLineItem}
              clearLineItems={clearLineItems}
              currency={currency}
              taxRate={taxRate}
              notes={notes}
              printRef={printRef}
            />
          </div>
        </div>
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            
            .print\\:border-none {
              border: none !important;
            }
            
            .print\\:m-0 {
              margin: 0 !important;
            }
            
            .print\\:p-0 {
              padding: 0 !important;
            }
            
            .print\\:bg-transparent {
              background-color: transparent !important;
            }
            
            .invoice-content {
              background: white !important;
              color: black !important;
            }
            
            .invoice-content * {
              visibility: visible !important;
            }
            
            .invoice-content {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: 100% !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default Index;
