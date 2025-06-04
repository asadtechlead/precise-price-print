
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ThemeSettingsProps {
  theme: string;
  invoiceTemplate: string;
  onThemeChange: (theme: string) => void;
  onInvoiceTemplateChange: (template: string) => void;
  onSave: () => Promise<void>;
  loading: boolean;
}

const ThemeSettings = ({
  theme,
  invoiceTemplate,
  onThemeChange,
  onInvoiceTemplateChange,
  onSave,
  loading
}: ThemeSettingsProps) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onSave();
      toast({
        title: "Settings Saved",
        description: "Your appearance settings have been saved."
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save appearance settings.",
        variant: "destructive"
      });
    }
  };

  return (
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
              value={theme}
              onValueChange={onThemeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="invoiceTemplate">Invoice Template</Label>
            <Select
              value={invoiceTemplate}
              onValueChange={onInvoiceTemplateChange}
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
        
        <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
          {loading ? "Saving..." : "Save Appearance Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
