
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem, Client, Product, Service } from '@/types';

interface InvoiceFormProps {
  invoice?: Invoice;
  clients: Client[];
  products: Product[];
  services: Service[];
  onSave: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
  currency: { symbol: string };
}

const InvoiceForm = ({ 
  invoice, 
  clients, 
  products, 
  services, 
  onSave, 
  onCancel, 
  isEditing = false,
  currency 
}: InvoiceFormProps) => {
  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || `INV-${Date.now()}`,
    clientId: invoice?.clientId || '',
    dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: invoice?.taxRate || 0,
    notes: invoice?.notes || '',
    status: invoice?.status || 'draft' as const,
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || [
      {
        id: '1',
        type: 'product',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ]
  );

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      type: 'product',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        if (field === 'productId' && value) {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedItem.description = product.name;
            updatedItem.rate = product.price;
            updatedItem.amount = updatedItem.quantity * product.price;
          }
        }
        if (field === 'serviceId' && value) {
          const service = services.find(s => s.id === value);
          if (service) {
            updatedItem.description = service.name;
            updatedItem.rate = service.hourlyRate;
            updatedItem.amount = updatedItem.quantity * service.hourlyRate;
          }
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (formData.taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceData = {
      ...formData,
      items,
      subtotal,
      taxAmount,
      total,
    };
    onSave(invoiceData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-semibold">Line Items</Label>
              <Button type="button" onClick={addItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value: any) => updateItem(item.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {item.type === 'product' && (
                      <div>
                        <Label>Product</Label>
                        <Select
                          value={item.productId || ''}
                          onValueChange={(value) => updateItem(item.id, 'productId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {item.type === 'service' && (
                      <div>
                        <Label>Service</Label>
                        <Select
                          value={item.serviceId || ''}
                          onValueChange={(value) => updateItem(item.id, 'serviceId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <Label>Rate ({currency.symbol})</Label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {currency.symbol}{item.amount.toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Totals and Tax */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{currency.symbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label htmlFor="taxRate">Tax Rate (%):</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  className="w-20"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{currency.symbol}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{currency.symbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Payment terms, additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Invoice' : 'Create Invoice'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
