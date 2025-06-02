
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, X } from 'lucide-react';

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

interface InvoicePreviewProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyInfo: CompanyInfo;
  customerInfo: CustomerInfo;
  lineItems: LineItem[];
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, field: string, value: string | number) => void;
  clearLineItems: () => void;
  currency: Currency;
  taxRate: number;
  notes: string;
  printRef: React.RefObject<HTMLDivElement>;
}

const InvoicePreview = ({
  invoiceNumber,
  invoiceDate,
  dueDate,
  companyInfo,
  customerInfo,
  lineItems,
  addLineItem,
  removeLineItem,
  updateLineItem,
  clearLineItems,
  currency,
  taxRate,
  notes,
  printRef
}: InvoicePreviewProps) => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <Card className="print:shadow-none print:border-none print:m-0">
      <CardContent ref={printRef} className="p-8 print:p-0 invoice-content">
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
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">Rate ({currency.symbol})</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">Amount ({currency.symbol})</th>
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
                      {currency.symbol}{item.amount.toFixed(2)}
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
                <span>{currency.symbol}{subtotal.toFixed(2)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax ({taxRate}%):</span>
                  <span>{currency.symbol}{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{currency.symbol}{total.toFixed(2)}</span>
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
  );
};

export default InvoicePreview;
