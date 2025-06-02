import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/Layout/MobileLayout';
import Dashboard from '@/components/Dashboard/Dashboard';
import ClientList from '@/components/Clients/ClientList';
import ClientForm from '@/components/Clients/ClientForm';
import ProductList from '@/components/Products/ProductList';
import ProductForm from '@/components/Products/ProductForm';
import ServiceList from '@/components/Services/ServiceList';
import ServiceForm from '@/components/Services/ServiceForm';
import InvoiceList from '@/components/Invoices/InvoiceList';
import InvoiceForm from '@/components/Invoices/InvoiceForm';
import Analytics from '@/components/Analytics/Analytics';
import Settings from '@/components/Settings/Settings';
import { Client, Product, Service, Invoice, DashboardStats, Currency } from '@/types';
import { sampleClients, sampleProducts, sampleServices, sampleInvoices } from '@/utils/sampleData';

const CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const BusinessApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // PKR as default
  
  // Initialize with sample data
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  
  // Form states
  const [showClientForm, setShowClientForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  
  // Editing states
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Calculate real-time dashboard stats
  const dashboardStats: DashboardStats = {
    totalPending: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
    totalEarned: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    totalClients: clients.length,
    totalInvoices: invoices.length,
    overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
    thisMonthEarnings: invoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      const now = new Date();
      return invDate.getMonth() === now.getMonth() && 
             invDate.getFullYear() === now.getFullYear() &&
             inv.status === 'paid';
    }).reduce((sum, inv) => sum + inv.total, 0),
  };

  // Client handlers
  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleViewClient = (client: Client) => {
    console.log('View client:', client);
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...clientData, id: editingClient.id, createdAt: editingClient.createdAt }
          : client
      ));
    } else {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setClients([...clients, newClient]);
    }
    setShowClientForm(false);
    setEditingClient(null);
  };

  // Product handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleViewProduct = (product: Product) => {
    console.log('View product:', product);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id, createdAt: editingProduct.createdAt }
          : product
      ));
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Service handlers
  const handleAddService = () => {
    setEditingService(null);
    setShowServiceForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleViewService = (service: Service) => {
    console.log('View service:', service);
  };

  const handleSaveService = (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...serviceData, id: editingService.id, createdAt: editingService.createdAt }
          : service
      ));
    } else {
      const newService: Service = {
        ...serviceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setServices([...services, newService]);
    }
    setShowServiceForm(false);
    setEditingService(null);
  };

  // Invoice handlers
  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('View invoice:', invoice);
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    if (editingInvoice) {
      setInvoices(invoices.map(invoice => 
        invoice.id === editingInvoice.id 
          ? { ...invoiceData, id: editingInvoice.id, createdAt: editingInvoice.createdAt }
          : invoice
      ));
    } else {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setInvoices([...invoices, newInvoice]);
    }
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const renderCurrentPage = () => {
    // Form renders
    if (showClientForm) {
      return (
        <ClientForm
          client={editingClient || undefined}
          onSave={handleSaveClient}
          onCancel={() => {
            setShowClientForm(false);
            setEditingClient(null);
          }}
          isEditing={!!editingClient}
        />
      );
    }

    if (showProductForm) {
      return (
        <ProductForm
          product={editingProduct || undefined}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          isEditing={!!editingProduct}
        />
      );
    }

    if (showServiceForm) {
      return (
        <ServiceForm
          service={editingService || undefined}
          onSave={handleSaveService}
          onCancel={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
          isEditing={!!editingService}
        />
      );
    }

    if (showInvoiceForm) {
      return (
        <InvoiceForm
          invoice={editingInvoice || undefined}
          clients={clients}
          products={products}
          services={services}
          onSave={handleSaveInvoice}
          onCancel={() => {
            setShowInvoiceForm(false);
            setEditingInvoice(null);
          }}
          isEditing={!!editingInvoice}
          currency={currency}
        />
      );
    }

    // Page renders
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stats={dashboardStats} currency={currency} />;
      case 'clients':
        return (
          <ClientList
            clients={clients}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
            onViewClient={handleViewClient}
            currency={currency}
          />
        );
      case 'products':
        return (
          <ProductList
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onViewProduct={handleViewProduct}
            currency={currency}
          />
        );
      case 'services':
        return (
          <ServiceList
            services={services}
            onAddService={handleAddService}
            onEditService={handleEditService}
            onViewService={handleViewService}
            currency={currency}
          />
        );
      case 'invoices':
        return (
          <InvoiceList
            invoices={invoices}
            clients={clients}
            onAddInvoice={handleAddInvoice}
            onEditInvoice={handleEditInvoice}
            onViewInvoice={handleViewInvoice}
            currency={currency}
          />
        );
      case 'analytics':
        return (
          <Analytics
            invoices={invoices}
            clients={clients}
            products={products}
            services={services}
            currency={currency}
          />
        );
      case 'settings':
        return (
          <Settings
            currency={currency}
            currencies={CURRENCIES}
            onCurrencyChange={setCurrency}
          />
        );
      default:
        return <Dashboard stats={dashboardStats} currency={currency} />;
    }
  };

  return (
    <MobileLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </MobileLayout>
  );
};

export default BusinessApp;
