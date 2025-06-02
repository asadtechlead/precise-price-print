
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CustomerInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
}

interface CustomerFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  clearCustomerInfo: () => void;
}

const CustomerForm = ({ customerInfo, setCustomerInfo, clearCustomerInfo }: CustomerFormProps) => {
  return (
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
  );
};

export default CustomerForm;
