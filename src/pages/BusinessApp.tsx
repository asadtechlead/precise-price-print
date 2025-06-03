
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dataService } from '@/services/dataService';
import { Currency } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useBusinessData } from '@/hooks/useBusinessData';
import { useFormStates } from '@/hooks/useFormStates';
import AuthForm from '@/components/Auth/AuthForm';
import MobileLayout from '@/components/Layout/MobileLayout';
import BusinessAppContent from '@/components/BusinessApp/BusinessAppContent';

const CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const BusinessApp = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  // Use custom hooks for data and form state management
  const businessData = useBusinessData({ user, loading });
  const formStates = useFormStates();

  // Load currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('invoicepro_currency');
    if (savedCurrency) {
      const currencyData = JSON.parse(savedCurrency);
      const foundCurrency = CURRENCIES.find(c => c.code === currencyData.code);
      if (foundCurrency) {
        setCurrency(foundCurrency);
      }
    }
  }, []);

  // Save currency to localStorage
  useEffect(() => {
    localStorage.setItem('invoicepro_currency', JSON.stringify(currency));
  }, [currency]);

  // Show auth form if not authenticated
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleSaveInvoice = async (invoiceData: any) => {
    try {
      if (formStates.editingInvoice) {
        const updatedInvoice = await dataService.updateInvoice(formStates.editingInvoice.id, invoiceData, user.id);
        businessData.setInvoices(businessData.invoices.map(i => i.id === formStates.editingInvoice.id ? updatedInvoice : i));
        toast({ title: "Invoice updated successfully" });
      } else {
        const newInvoice = await dataService.createInvoice(invoiceData, user.id);
        businessData.setInvoices([...businessData.invoices, newInvoice]);
        toast({ title: "Invoice created successfully" });
      }
      formStates.setIsInvoiceFormOpen(false);
      formStates.setEditingInvoice(undefined);
    } catch (error) {
      toast({ title: "Error saving invoice", variant: "destructive" });
    }
  };

  const handleCancelInvoice = () => {
    formStates.setIsInvoiceFormOpen(false);
    formStates.setEditingInvoice(undefined);
  };

  const handleCurrencyChange = (currency: Currency) => {
    setCurrency(currency);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Client handlers
  const handleClientSave = async (clientData: any) => {
    try {
      if (formStates.editingClient) {
        const updatedClient = await dataService.updateClient(formStates.editingClient.id, clientData, user.id);
        businessData.setClients(businessData.clients.map(c => c.id === formStates.editingClient.id ? updatedClient : c));
        toast({ title: "Client updated successfully" });
      } else {
        const newClient = await dataService.createClient(clientData, user.id);
        businessData.setClients([...businessData.clients, newClient]);
        toast({ title: "Client created successfully" });
      }
      formStates.setIsClientFormOpen(false);
      formStates.setEditingClient(undefined);
    } catch (error) {
      toast({ title: "Error saving client", variant: "destructive" });
    }
  };

  const handleClientCancel = () => {
    formStates.setIsClientFormOpen(false);
    formStates.setEditingClient(undefined);
  };

  // Product handlers
  const handleProductSave = async (productData: any) => {
    try {
      if (formStates.editingProduct) {
        const updatedProduct = await dataService.updateProduct(formStates.editingProduct.id, productData, user.id);
        businessData.setProducts(businessData.products.map(p => p.id === formStates.editingProduct.id ? updatedProduct : p));
        toast({ title: "Product updated successfully" });
      } else {
        const newProduct = await dataService.createProduct(productData, user.id);
        businessData.setProducts([...businessData.products, newProduct]);
        toast({ title: "Product created successfully" });
      }
      formStates.setIsProductFormOpen(false);
      formStates.setEditingProduct(undefined);
    } catch (error) {
      toast({ title: "Error saving product", variant: "destructive" });
    }
  };

  const handleProductCancel = () => {
    formStates.setIsProductFormOpen(false);
    formStates.setEditingProduct(undefined);
  };

  // Service handlers
  const handleServiceSave = async (serviceData: any) => {
    try {
      if (formStates.editingService) {
        const updatedService = await dataService.updateService(formStates.editingService.id, serviceData, user.id);
        businessData.setServices(businessData.services.map(s => s.id === formStates.editingService.id ? updatedService : s));
        toast({ title: "Service updated successfully" });
      } else {
        const newService = await dataService.createService(serviceData, user.id);
        businessData.setServices([...businessData.services, newService]);
        toast({ title: "Service created successfully" });
      }
      formStates.setIsServiceFormOpen(false);
      formStates.setEditingService(undefined);
    } catch (error) {
      toast({ title: "Error saving service", variant: "destructive" });
    }
  };

  const handleServiceCancel = () => {
    formStates.setIsServiceFormOpen(false);
    formStates.setEditingService(undefined);
  };

  return (
    <MobileLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <BusinessAppContent
        currentPage={currentPage}
        currency={currency}
        currencies={CURRENCIES}
        clients={businessData.clients}
        products={businessData.products}
        services={businessData.services}
        invoices={businessData.invoices}
        calculateDashboardStats={businessData.calculateDashboardStats}
        isClientFormOpen={formStates.isClientFormOpen}
        isProductFormOpen={formStates.isProductFormOpen}
        isServiceFormOpen={formStates.isServiceFormOpen}
        isInvoiceFormOpen={formStates.isInvoiceFormOpen}
        editingClient={formStates.editingClient}
        editingProduct={formStates.editingProduct}
        editingService={formStates.editingService}
        editingInvoice={formStates.editingInvoice}
        user={user}
        onCurrencyChange={handleCurrencyChange}
        onClientSave={handleClientSave}
        onClientCancel={handleClientCancel}
        onProductSave={handleProductSave}
        onProductCancel={handleProductCancel}
        onServiceSave={handleServiceSave}
        onServiceCancel={handleServiceCancel}
        onInvoiceSave={handleSaveInvoice}
        onInvoiceCancel={handleCancelInvoice}
        onClientAdd={formStates.handleCreateClient}
        onClientEdit={formStates.handleEditClient}
        onClientDelete={businessData.handleDeleteClient}
        onProductAdd={formStates.handleCreateProduct}
        onProductEdit={formStates.handleEditProduct}
        onProductDelete={businessData.handleDeleteProduct}
        onServiceAdd={formStates.handleCreateService}
        onServiceEdit={formStates.handleEditService}
        onServiceDelete={businessData.handleDeleteService}
        onInvoiceAdd={formStates.handleCreateInvoice}
        onInvoiceEdit={formStates.handleEditInvoice}
        onInvoiceView={formStates.handleViewInvoice}
        onAICreateClient={businessData.handleAICreateClient}
        onAICreateProduct={businessData.handleAICreateProduct}
        onAICreateService={businessData.handleAICreateService}
        onAICreateInvoice={businessData.handleAICreateInvoice}
      />
    </MobileLayout>
  );
};

export default BusinessApp;
