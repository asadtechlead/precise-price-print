
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Wand2, User, Building, Package, Briefcase, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Client, Product, Service, Invoice } from '@/types';

interface AIAssistantProps {
  onCreateClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onCreateProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onCreateService: (service: Omit<Service, 'id' | 'createdAt'>) => void;
  onCreateInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  clients: Client[];
  currency: { symbol: string };
}

const AIAssistant = ({ onCreateClient, onCreateProduct, onCreateService, onCreateInvoice, clients, currency }: AIAssistantProps) => {
  const [selectedType, setSelectedType] = useState<'client' | 'product' | 'service' | 'invoice'>('client');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a description", variant: "destructive" });
      return;
    }

    if (!apiKey.trim()) {
      toast({ title: "Please enter your Google Gemini API key", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: getPromptForType(selectedType, prompt)
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;

      if (generatedText) {
        parseAndCreate(selectedType, generatedText);
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({ 
        title: "Error generating content", 
        description: "Please check your API key and try again",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPromptForType = (type: string, userPrompt: string) => {
    const baseInstructions = "Generate ONLY valid JSON data based on the user's description. Do not include any other text, explanations, or markdown formatting. Return only the JSON object.";
    
    switch (type) {
      case 'client':
        return `${baseInstructions} Create a client object with fields: name, email, phone, address, city, state, zip, balance (number, default 0). User description: ${userPrompt}`;
      case 'product':
        return `${baseInstructions} Create a product object with fields: name, description, price (number), unit (string like "piece", "kg"), stockQuantity (number, default 0), trackStock (boolean, default false), category. User description: ${userPrompt}`;
      case 'service':
        return `${baseInstructions} Create a service object with fields: name, description, hourlyRate (number), category. User description: ${userPrompt}`;
      case 'invoice':
        return `${baseInstructions} Create an invoice object with fields: invoiceNumber (string), clientId (use first available client), items (array with objects having: type, description, quantity, rate, amount), subtotal (number), taxRate (number, default 0.1), taxAmount (number), total (number), status ("draft"), dueDate (ISO string, 30 days from now), notes. User description: ${userPrompt}`;
      default:
        return userPrompt;
    }
  };

  const parseAndCreate = (type: string, jsonString: string) => {
    try {
      // Clean the JSON string
      const cleanJson = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      switch (type) {
        case 'client':
          onCreateClient({
            name: parsedData.name || 'Unnamed Client',
            email: parsedData.email || '',
            phone: parsedData.phone || '',
            address: parsedData.address || '',
            city: parsedData.city || '',
            state: parsedData.state || '',
            zip: parsedData.zip || '',
            balance: parsedData.balance || 0
          });
          break;
        case 'product':
          onCreateProduct({
            name: parsedData.name || 'Unnamed Product',
            description: parsedData.description || '',
            price: parsedData.price || 0,
            unit: parsedData.unit || 'piece',
            stockQuantity: parsedData.stockQuantity || 0,
            trackStock: parsedData.trackStock || false,
            category: parsedData.category || 'General'
          });
          break;
        case 'service':
          onCreateService({
            name: parsedData.name || 'Unnamed Service',
            description: parsedData.description || '',
            hourlyRate: parsedData.hourlyRate || 0,
            category: parsedData.category || 'General'
          });
          break;
        case 'invoice':
          if (clients.length === 0) {
            toast({ title: "No clients available", description: "Create a client first before generating invoices", variant: "destructive" });
            return;
          }
          
          onCreateInvoice({
            invoiceNumber: parsedData.invoiceNumber || `INV-${Date.now()}`,
            clientId: parsedData.clientId || clients[0].id,
            items: parsedData.items || [],
            subtotal: parsedData.subtotal || 0,
            taxRate: parsedData.taxRate || 0.1,
            taxAmount: parsedData.taxAmount || 0,
            total: parsedData.total || 0,
            status: 'draft',
            dueDate: parsedData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            notes: parsedData.notes || ''
          });
          break;
      }

      toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!` });
      setPrompt('');
    } catch (error) {
      console.error('Error parsing generated content:', error);
      toast({ 
        title: "Error parsing generated content", 
        description: "The AI generated invalid data. Please try again with a different description.",
        variant: "destructive" 
      });
    }
  };

  const getIcon = () => {
    switch (selectedType) {
      case 'client': return <User className="h-5 w-5" />;
      case 'product': return <Package className="h-5 w-5" />;
      case 'service': return <Briefcase className="h-5 w-5" />;
      case 'invoice': return <FileText className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bot className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Create with AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Google Gemini API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Google Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
            </p>
          </div>

          <div>
            <Label htmlFor="type">What would you like to create?</Label>
            <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client
                  </div>
                </SelectItem>
                <SelectItem value="product">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Product
                  </div>
                </SelectItem>
                <SelectItem value="service">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Service
                  </div>
                </SelectItem>
                <SelectItem value="invoice">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Invoice
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prompt">Describe what you want to create</Label>
            <Textarea
              id="prompt"
              placeholder={getPlaceholderText(selectedType)}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              getIcon()
            )}
            {isLoading ? 'Generating...' : `Generate ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Client:</strong> "Tech startup company called InnovateTech, based in San Francisco, contact email: info@innovatetech.com"</p>
            <p><strong>Product:</strong> "Premium wireless headphones with noise cancellation, priced at $299, sold per piece"</p>
            <p><strong>Service:</strong> "Web development consultation service, $150 per hour, specializing in React and Node.js"</p>
            <p><strong>Invoice:</strong> "Invoice for website development project, 40 hours at $100/hour plus $500 for hosting setup"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getPlaceholderText = (type: string) => {
  switch (type) {
    case 'client':
      return "e.g., A marketing agency called 'Creative Solutions' located in New York, contact person John Smith, email john@creative.com";
    case 'product':
      return "e.g., High-quality coffee beans from Colombia, premium roast, sold per kg, priced at $25";
    case 'service':
      return "e.g., Graphic design service for logos and branding, $75 per hour, specializes in modern minimalist designs";
    case 'invoice':
      return "e.g., Invoice for logo design project, 10 hours of work at $75/hour plus $200 for revisions";
    default:
      return "Describe what you want to create...";
  }
};

export default AIAssistant;
