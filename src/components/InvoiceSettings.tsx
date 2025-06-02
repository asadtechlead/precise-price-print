
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface InvoiceSettingsProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  clearInvoiceSettings: () => void;
  currencies: Currency[];
}

const InvoiceSettings = ({
  currency,
  setCurrency,
  dueDate,
  setDueDate,
  taxRate,
  setTaxRate,
  notes,
  setNotes,
  clearInvoiceSettings,
  currencies
}: InvoiceSettingsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-blue-900">Invoice Settings</CardTitle>
        <Button onClick={clearInvoiceSettings} variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency.code} onValueChange={(value) => {
            const selectedCurrency = currencies.find(c => c.code === value);
            if (selectedCurrency) {
              setCurrency(selectedCurrency);
            }
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} - {curr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
  );
};

export default InvoiceSettings;
