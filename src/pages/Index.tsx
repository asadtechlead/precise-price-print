
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Printer, Download, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      notes
    }));
  }, [dueDate, taxRate, notes]);

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
    toast({
      title: "Invoice settings cleared",
      description: "Due date, tax rate, and notes have been reset.",
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
            {/* Company Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-blue-900">Company Information</CardTitle>
                <Button onClick={clearCompanyInfo} variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="company-address">Address</Label>
                  <Input
                    id="company-address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                    placeholder="Street Address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="company-city">City</Label>
                    <Input
                      id="company-city"
                      value={companyInfo.city}
                      onChange={(e) => setCompanyInfo({...companyInfo, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-state">State</Label>
                    <Input
                      id="company-state"
                      value={companyInfo.state}
                      onChange={(e) => setCompanyInfo({...companyInfo, state: e.target.value})}
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="company-zip">ZIP Code</Label>
                    <Input
                      id="company-zip"
                      value={companyInfo.zip}
                      onChange={(e) => setCompanyInfo({...companyInfo, zip: e.target.value})}
                      placeholder="ZIP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input
                      id="company-phone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                    placeholder="company@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-blue-900">Bill To</CardTitle>
                <Button onClick={clearCustomerInfo} variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="Customer Name"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-address">Address</Label>
                  <Input
                    id="customer-address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    placeholder="Street Address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="customer-city">City</Label>
                    <Input
                      id="customer-city"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-state">State</Label>
                    <Input
                      id="customer-state"
                      value={customerInfo.state}
                      onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="customer-zip">ZIP Code</Label>
                    <Input
                      id="customer-zip"
                      value={customerInfo.zip}
                      onChange={(e) => setCustomerInfo({...customerInfo, zip: e.target.value})}
                      placeholder="ZIP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="customer@email.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Settings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-blue-900">Invoice Settings</CardTitle>
                <Button onClick={clearInvoiceSettings} variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Payment terms, additional notes..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Invoice Preview */}
          <div className="lg:col-span-2">
            <Card className="print:shadow-none print:border-none">
              <CardContent ref={printRef} className="p-8 print:p-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">INVOICE</h1>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-semibold">Invoice #:</span> {invoiceNumber}</p>
                      <p><span className="font-semibold">Date:</span> {invoiceDate}</p>
                      {dueDate && <p><span className="font-semibold">Due Date:</span> {new Date(dueDate).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    {companyInfo.name && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{companyInfo.name}</h2>
                        <div className="text-sm text-gray-600">
                          {companyInfo.address && <p>{companyInfo.address}</p>}
                          {(companyInfo.city || companyInfo.state || companyInfo.zip) && (
                            <p>{companyInfo.city}{companyInfo.city && companyInfo.state && ', '}{companyInfo.state} {companyInfo.zip}</p>
                          )}
                          {companyInfo.phone && <p>{companyInfo.phone}</p>}
                          {companyInfo.email && <p>{companyInfo.email}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Bill To Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="text-sm text-gray-600">
                    {customerInfo.name && <p className="font-semibold text-gray-900">{customerInfo.name}</p>}
                    {customerInfo.address && <p>{customerInfo.address}</p>}
                    {(customerInfo.city || customerInfo.state || customerInfo.zip) && (
                      <p>{customerInfo.city}{customerInfo.city && customerInfo.state && ', '}{customerInfo.state} {customerInfo.zip}</p>
                    )}
                    {customerInfo.email && <p>{customerInfo.email}</p>}
                  </div>
                </div>

                {/* Line Items */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                    <Button
                      onClick={clearLineItems}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 print:hidden"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear Items
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 text-sm font-semibold text-gray-900">Description</th>
                          <th className="text-center py-3 text-sm font-semibold text-gray-900 w-20">Qty</th>
                          <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">Rate</th>
                          <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">Amount</th>
                          <th className="w-10 print:hidden"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-3 pr-4">
                              <Input
                                value={item.description}
                                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                placeholder="Description of service/product"
                                className="border-none p-0 h-auto text-sm focus:ring-0 print:bg-transparent"
                              />
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                                className="border-none p-0 h-auto text-sm text-center focus:ring-0 print:bg-transparent"
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))}
                                className="border-none p-0 h-auto text-sm text-right focus:ring-0 print:bg-transparent"
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="py-3 pl-2 text-right text-sm">
                              ${item.amount.toFixed(2)}
                            </td>
                            <td className="py-3 print:hidden">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLineItem(item.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                disabled={lineItems.length === 1}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 print:hidden">
                    <Button
                      onClick={addLineItem}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Line Item
                    </Button>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {taxRate > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Tax ({taxRate}%):</span>
                          <span>${taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {notes && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            
            .print\\:block {
              display: block !important;
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
            
            .print\\:p-6 {
              padding: 1.5rem !important;
            }
            
            .print\\:bg-transparent {
              background-color: transparent !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default Index;
