
import React, { useState } from 'react';
import { Currency, Client, Product, Service, Invoice } from '@/types';
import Dashboard from '@/components/Dashboard/Dashboard';
import ClientList from '@/components/Clients/ClientList';
import ClientForm from '@/components/Clients/ClientForm';
import ProductList from '@/components/Products/ProductList';
import ProductForm from '@/components/Products/ProductForm';
import ServiceList from '@/components/Services/ServiceList';
import ServiceForm from '@/components/Services/ServiceForm';
import InvoiceList from '@/components/Invoices/InvoiceList';
import InvoiceForm from '@/components/Invoices/InvoiceForm';
import InvoiceView from '@/components/Invoices/InvoiceView';
import Analytics from '@/components/Analytics/Analytics';
import Settings from '@/components/Settings/Settings';
import AIAssistant from '@/components/AI/AIAssistant';
import UserProfile from '@/components/Auth/UserProfile';
import { useAuth } from '@/hooks/useAuth';

interface BusinessAppContentProps {
  currentPage: string;
  currency: Currency;
  currencies: Currency[];
  clients: Client[];
  products: Product[];
  services: Service[];
  invoices: Invoice[];
  calculateDashboardStats: () => any;
  isClientFormOpen: boolean;
  isProductFormOpen: boolean;
  isServiceFormOpen: boolean;
  isInvoiceFormOpen: boolean;
  editingClient?: Client;
  editingProduct?: Product;
  editingService?: Service;
  editingInvoice?: Invoice;
  viewingInvoice?: Invoice;
  user: any;
  onCurrencyChange: (currency: Currency) => void;
  onClientSave: (clientData: any) => Promise<void>;
  onClientCancel: () => void;
  onProductSave: (productData: any) => Promise<void>;
  onProductCancel: () => void;
  onServiceSave: (serviceData: any) => Promise<void>;
  onServiceCancel: () => void;
  onInvoiceSave: (invoiceData: any) => Promise<void>;
  onInvoiceCancel: () => void;
  onClientAdd: () => void;
  onClientEdit: (client: Client) => void;
  onClientDelete: (id: string) => Promise<void>;
  onProductAdd: () => void;
  onProductEdit: (product: Product) => void;
  onProductDelete: (id: string) => Promise<void>;
  onServiceAdd: () => void;
  onServiceEdit: (service: Service) => void;
  onServiceDelete: (id: string) => Promise<void>;
  onInvoiceAdd: () => void;
  onInvoiceEdit: (invoice: Invoice) => void;
  onInvoiceView: (invoice: Invoice) => void;
  onInvoiceViewClose: () => void;
  onAICreateClient: (clientData: any) => Promise<void>;
  onAICreateProduct: (productData: any) => Promise<void>;
  onAICreateService: (serviceData: any) => Promise<void>;
  onAICreateInvoice: (invoiceData: any) => Promise<void>;
  onSignOut: () => void;
  onUpdateProfile: (userData: any) => Promise<void>;
}

const BusinessAppContent = ({
  currentPage,
  currency,
  currencies,
  clients,
  products,
  services,
  invoices,
  calculateDashboardStats,
  isClientFormOpen,
  isProductFormOpen,
  isServiceFormOpen,
  isInvoiceFormOpen,
  editingClient,
  editingProduct,
  editingService,
  editingInvoice,
  viewingInvoice,
  user,
  onCurrencyChange,
  onClientSave,
  onClientCancel,
  onProductSave,
  onProductCancel,
  onServiceSave,
  onServiceCancel,
  onInvoiceSave,
  onInvoiceCancel,
  onClientAdd,
  onClientEdit,
  onClientDelete,
  onProductAdd,
  onProductEdit,
  onProductDelete,
  onServiceAdd,
  onServiceEdit,
  onServiceDelete,
  onInvoiceAdd,
  onInvoiceEdit,
  onInvoiceView,
  onInvoiceViewClose,
  onAICreateClient,
  onAICreateProduct,
  onAICreateService,
  onAICreateInvoice,
  onSignOut,
  onUpdateProfile
}: BusinessAppContentProps) => {
  if (isClientFormOpen) {
    return (
      <ClientForm
        client={editingClient}
        onSave={onClientSave}
        onCancel={onClientCancel}
        isEditing={!!editingClient}
      />
    );
  }

  if (isProductFormOpen) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={onProductSave}
        onCancel={onProductCancel}
        isEditing={!!editingProduct}
      />
    );
  }

  if (isServiceFormOpen) {
    return (
      <ServiceForm
        service={editingService}
        onSave={onServiceSave}
        onCancel={onServiceCancel}
        isEditing={!!editingService}
      />
    );
  }

  if (isInvoiceFormOpen) {
    return (
      <InvoiceForm
        invoice={editingInvoice}
        clients={clients}
        products={products}
        services={services}
        onSave={onInvoiceSave}
        onCancel={onInvoiceCancel}
        isEditing={!!editingInvoice}
        currency={currency}
      />
    );
  }

  if (viewingInvoice) {
    const client = clients.find(c => c.id === viewingInvoice.clientId);
    if (client) {
      return (
        <InvoiceView 
          invoice={viewingInvoice} 
          client={client} 
          onBack={onInvoiceViewClose} 
          currency={currency} 
        />
      );
    }
  }

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard stats={calculateDashboardStats()} currency={currency} />;
    case 'clients':
      return (
        <ClientList
          clients={clients}
          onAddClient={onClientAdd}
          onEditClient={onClientEdit}
          onDeleteClient={onClientDelete}
          currency={currency}
        />
      );
    case 'products':
      return (
        <ProductList
          products={products}
          onAddProduct={onProductAdd}
          onEditProduct={onProductEdit}
          onDeleteProduct={onProductDelete}
          currency={currency}
        />
      );
    case 'services':
      return (
        <ServiceList
          services={services}
          onAddService={onServiceAdd}
          onEditService={onServiceEdit}
          onDeleteService={onServiceDelete}
          currency={currency}
        />
      );
    case 'invoices':
      return (
        <InvoiceList
          invoices={invoices}
          clients={clients}
          onAddInvoice={onInvoiceAdd}
          onEditInvoice={onInvoiceEdit}
          onViewInvoice={onInvoiceView}
          currency={currency}
        />
      );
    case 'analytics':
      return <Analytics invoices={invoices} clients={clients} products={products} services={services} currency={currency} />;
    case 'ai-assistant':
      return (
        <AIAssistant
          onCreateClient={onAICreateClient}
          onCreateProduct={onAICreateProduct}
          onCreateService={onAICreateService}
          onCreateInvoice={onAICreateInvoice}
          clients={clients}
          currency={currency}
        />
      );
    case 'settings':
      return <Settings currency={currency} currencies={currencies} onCurrencyChange={onCurrencyChange} />;
    case 'profile':
      return <UserProfile user={user} onUpdateProfile={onUpdateProfile} onSignOut={onSignOut} />;
    default:
      return <Dashboard stats={calculateDashboardStats()} currency={currency} />;
  }
};

export default BusinessAppContent;
