
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

interface CompanyFormProps {
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
  clearCompanyInfo: () => void;
}

const CompanyForm = ({ companyInfo, setCompanyInfo, clearCompanyInfo }: CompanyFormProps) => {
  return (
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
  );
};

export default CompanyForm;
