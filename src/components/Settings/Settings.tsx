
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Building, DollarSign, Bell, Shield, Palette } from 'lucide-react';
import { Currency } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { userSettingsService, UserSettings } from '@/services/userSettingsService';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  currency: Currency;
  currencies: Currency[];
  onCurrencyChange: (currency: Currency) => void;
}

const Settings = ({ currency, currencies, onCurrencyChange }: SettingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    defaultTaxRate: 0,
    defaultDueDays: 30,
    invoicePrefix: 'INV',
    paymentTerms: 'Net 30',
    footerText: 'Thank you for your business!',
  });

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    overdueAlerts: true,
    paymentReceived: true,
    newInvoice: false,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    primaryColor: '#3B82F6',
    invoiceTemplate: 'modern',
  });

  // Load user settings when component mounts
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const settings = await userSettingsService.getUserSettings(user.id);
        
        if (settings) {
          // Update company info
          setCompanyInfo({
            name: settings.company_name || '',
            address: settings.company_address || '',
            city: settings.company_city || '',
            state: settings.company_state || '',
            zip: settings.company_zip || '',
            phone: settings.company_phone || '',
            email: settings.company_email || '',
            website: settings.company_website || '',
            taxId: settings.company_tax_id || '',
          });

          // Update invoice settings
          setInvoiceSettings({
            defaultTaxRate: settings.default_tax_rate || 0,
            defaultDueDays: settings.default_due_days || 30,
            invoicePrefix: settings.invoice_prefix || 'INV',
            paymentTerms: settings.payment_terms || 'Net 30',
            footerText: settings.footer_text || 'Thank you for your business!',
          });

          // Update notifications
          setNotifications({
            emailReminders: settings.email_reminders ?? true,
            overdueAlerts: settings.overdue_alerts ?? true,
            paymentReceived: settings.payment_received ?? true,
            newInvoice: settings.new_invoice ?? false,
          });

          // Update appearance
          setAppearance({
            theme: settings.theme || 'light',
            primaryColor: settings.primary_color || '#3B82F6',
            invoiceTemplate: settings.invoice_template || 'modern',
          });

          // Update currency if different
          if (settings.default_currency_code && settings.default_currency_code !== currency.code) {
            const foundCurrency = currencies.find(c => c.code === settings.default_currency_code);
            if (foundCurrency) {
              onCurrencyChange(foundCurrency);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
        toast({
          title: "Error loading settings",
          description: "Failed to load your settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, [user, currencies, currency.code, onCurrencyChange, toast]);

  const saveSettings = async (settingsData: Partial<UserSettings>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await userSettingsService.upsertUserSettings({
        user_id: user.id,
        ...settingsData,
      });
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompanyInfo = () => {
    saveSettings({
      company_name: companyInfo.name,
      company_address: companyInfo.address,
      company_city: companyInfo.city,
      company_state: companyInfo.state,
      company_zip: companyInfo.zip,
      company_phone: companyInfo.phone,
      company_email: companyInfo.email,
      company_website: companyInfo.website,
      company_tax_id: companyInfo.taxId,
    });
  };

  const handleSaveInvoiceSettings = () => {
    saveSettings({
      default_tax_rate: invoiceSettings.defaultTaxRate,
      default_due_days: invoiceSettings.defaultDueDays,
      invoice_prefix: invoiceSettings.invoicePrefix,
      payment_terms: invoiceSettings.paymentTerms,
      footer_text: invoiceSettings.footerText,
      default_currency_code: currency.code,
    });
  };

  const handleSaveNotifications = () => {
    saveSettings({
      email_reminders: notifications.emailReminders,
      overdue_alerts: notifications.overdueAlerts,
      payment_received: notifications.paymentReceived,
      new_invoice: notifications.newInvoice,
    });
  };

  const handleSaveAppearance = () => {
    saveSettings({
      theme: appearance.theme,
      primary_color: appearance.primaryColor,
      invoice_template: appearance.invoiceTemplate,
    });
  };

  if (loading && !companyInfo.name) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1 sm:mt-0">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1 sm:mt-0">
          Manage your business preferences and configurations
        </p>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyInfo.website}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={companyInfo.city}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={companyInfo.state}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={companyInfo.zip}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, zip: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="taxId">Tax ID / Business Registration</Label>
            <Input
              id="taxId"
              value={companyInfo.taxId}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, taxId: e.target.value }))}
            />
          </div>
          
          <Button onClick={handleSaveCompanyInfo} disabled={loading} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Company Information
          </Button>
        </CardContent>
      </Card>

      {/* Currency & Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Currency & Invoice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={currency.code}
                onValueChange={(value) => {
                  const selectedCurrency = currencies.find(c => c.code === value);
                  if (selectedCurrency) {
                    onCurrencyChange(selectedCurrency);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} - {curr.name} ({curr.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={invoiceSettings.defaultTaxRate}
                onChange={(e) => setInvoiceSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) || 0 }))}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="dueDays">Default Due Days</Label>
              <Input
                id="dueDays"
                type="number"
                value={invoiceSettings.defaultDueDays}
                onChange={(e) => setInvoiceSettings(prev => ({ ...prev, defaultDueDays: parseInt(e.target.value) || 30 }))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
              <Input
                id="invoicePrefix"
                value={invoiceSettings.invoicePrefix}
                onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={invoiceSettings.paymentTerms}
              onChange={(e) => setInvoiceSettings(prev => ({ ...prev, paymentTerms: e.target.value }))}
              placeholder="e.g., Net 30, Due on receipt"
            />
          </div>
          
          <div>
            <Label htmlFor="footerText">Invoice Footer Text</Label>
            <Textarea
              id="footerText"
              value={invoiceSettings.footerText}
              onChange={(e) => setInvoiceSettings(prev => ({ ...prev, footerText: e.target.value }))}
              rows={3}
            />
          </div>
          
          <Button onClick={handleSaveInvoiceSettings} disabled={loading} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Invoice Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Reminders</Label>
                <p className="text-sm text-gray-500">Send automatic payment reminders</p>
              </div>
              <Switch
                checked={notifications.emailReminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailReminders: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Overdue Alerts</Label>
                <p className="text-sm text-gray-500">Get notified when invoices are overdue</p>
              </div>
              <Switch
                checked={notifications.overdueAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, overdueAlerts: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment Received</Label>
                <p className="text-sm text-gray-500">Notifications when payments are received</p>
              </div>
              <Switch
                checked={notifications.paymentReceived}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, paymentReceived: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>New Invoice Created</Label>
                <p className="text-sm text-gray-500">Get notified when new invoices are created</p>
              </div>
              <Switch
                checked={notifications.newInvoice}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newInvoice: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSaveNotifications} disabled={loading} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={appearance.theme}
                onValueChange={(value) => setAppearance(prev => ({ ...prev, theme: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="invoiceTemplate">Invoice Template</Label>
              <Select
                value={appearance.invoiceTemplate}
                onValueChange={(value) => setAppearance(prev => ({ ...prev, invoiceTemplate: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleSaveAppearance} disabled={loading} className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Appearance Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
