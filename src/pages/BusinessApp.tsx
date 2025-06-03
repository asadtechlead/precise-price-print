import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dataService } from '@/services/dataService';
import { sampleClients, sampleProducts, sampleServices, sampleInvoices } from '@/utils/sampleData';
import { Client, Product, Service, Invoice, Currency } from '@/types';
import { useToast } from '@/hooks/use-toast';
import AuthForm from '@/components/Auth/AuthForm';
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
import AIAssistant from '@/components/AI/AIAssistant';

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
  
  // Data states
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Form states
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | undefined>();

  // Load data from localStorage or sample data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          // Load from Supabase if user is authenticated
          const [clientsData, productsData, servicesData, invoicesData] = await Promise.all([
            dataService.getClients(user.id),
            dataService.getProducts(user.id),
            dataService.getServices(user.id),
            dataService.getInvoices(user.id)
          ]);
          
          setClients(clientsData.length > 0 ? clientsData : sampleClients);
          setProducts(productsData.length > 0 ? productsData : sampleProducts);
          setServices(servicesData.length > 0 ? servicesData : sampleServices);
          setInvoices(invoicesData.length > 0 ? invoicesData : sampleInvoices);
        } catch (error) {
          console.error('Error loading data from Supabase:', error);
          // Fallback to localStorage or sample data
          loadFromLocalStorage();
        }
      } else {
        // Load from localStorage if not authenticated
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedClients = localStorage.getItem('invoicepro_clients');
      const savedProducts = localStorage.getItem('invoicepro_products');
      const savedServices = localStorage.getItem('invoicepro_services');
      const savedInvoices = localStorage.getItem('invoicepro_invoices');
      const savedCurrency = localStorage.getItem('invoicepro_currency');

      setClients(savedClients ? JSON.parse(savedClients) : sampleClients);
      setProducts(savedProducts ? JSON.parse(savedProducts) : sampleProducts);
      setServices(savedServices ? JSON.parse(savedServices) : sampleServices);
      setInvoices(savedInvoices ? JSON.parse(savedInvoices) : sampleInvoices);
      
      if (savedCurrency) {
        const currencyData = JSON.parse(savedCurrency);
        const foundCurrency = CURRENCIES.find(c => c.code === currencyData.code);
        if (foundCurrency) {
          setCurrency(foundCurrency);
        }
      }
    };

    if (!loading) {
      loadData();
    }
  }, [user, loading]);

  // Save to localStorage whenever data changes (for non-authenticated users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('invoicepro_clients', JSON.stringify(clients));
    }
  }, [clients, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('invoicepro_products', JSON.stringify(products));
    }
  }, [products, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('invoicepro_services', JSON.stringify(services));
    }
  }, [services, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('invoicepro_invoices', JSON.stringify(invoices));
    }
  }, [invoices, user]);

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

  const handleCreateClient = () => {
    setIsClientFormOpen(true);
    setEditingClient(undefined);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await dataService.deleteClient(id, user.id);
      setClients(clients.filter(c => c.id !== id));
      toast({ title: "Client deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting client", variant: "destructive" });
    }
  };

  const handleCreateProduct = () => {
    setIsProductFormOpen(true);
    setEditingProduct(undefined);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await dataService.deleteProduct(id, user.id);
      setProducts(products.filter(p => p.id !== id));
      toast({ title: "Product deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  };

  const handleCreateService = () => {
    setIsServiceFormOpen(true);
    setEditingService(undefined);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceFormOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    try {
      await dataService.deleteService(id, user.id);
      setServices(services.filter(s => s.id !== id));
      toast({ title: "Service deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting service", variant: "destructive" });
    }
  };

  const handleCreateInvoice = () => {
    setIsInvoiceFormOpen(true);
    setEditingInvoice(undefined);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceFormOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  const handleSaveInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    try {
      if (editingInvoice) {
        const updatedInvoice = await dataService.updateInvoice(editingInvoice.id, invoiceData, user.id);
        setInvoices(invoices.map(i => i.id === editingInvoice.id ? updatedInvoice : i));
        toast({ title: "Invoice updated successfully" });
      } else {
        const newInvoice = await dataService.createInvoice(invoiceData, user.id);
        setInvoices([...invoices, newInvoice]);
        toast({ title: "Invoice created successfully" });
      }
      setIsInvoiceFormOpen(false);
      setEditingInvoice(undefined);
    } catch (error) {
      toast({ title: "Error saving invoice", variant: "destructive" });
    }
  };

  const handleCancelInvoice = () => {
    setIsInvoiceFormOpen(false);
    setEditingInvoice(undefined);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await dataService.deleteInvoice(id, user.id);
      setInvoices(invoices.filter(i => i.id !== id));
      toast({ title: "Invoice deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting invoice", variant: "destructive" });
    }
  };

  const handleCurrencyChange = (currency: Currency) => {
    setCurrency(currency);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // AI Assistant handlers
  const handleAICreateClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      const newClient = await dataService.createClient(clientData, user.id);
      setClients([...clients, newClient]);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleAICreateProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct = await dataService.createProduct(productData, user.id);
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleAICreateService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    try {
      const newService = await dataService.createService(serviceData, user.id);
      setServices([...services, newService]);
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleAICreateInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    try {
      const newInvoice = await dataService.createInvoice(invoiceData, user.id);
      setInvoices([...invoices, newInvoice]);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const renderCurrentPage = () => {
    if (isClientFormOpen) {
      return (
        <ClientForm
          client={editingClient}
          onSave={async (clientData) => {
            try {
              if (editingClient) {
                const updatedClient = await dataService.updateClient(editingClient.id, clientData, user.id);
                setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
                toast({ title: "Client updated successfully" });
              } else {
                const newClient = await dataService.createClient(clientData, user.id);
                setClients([...clients, newClient]);
                toast({ title: "Client created successfully" });
              }
              setIsClientFormOpen(false);
              setEditingClient(undefined);
            } catch (error) {
              toast({ title: "Error saving client", variant: "destructive" });
            }
          }}
          onCancel={() => {
            setIsClientFormOpen(false);
            setEditingClient(undefined);
          }}
          isEditing={!!editingClient}
        />
      );
    }

    if (isProductFormOpen) {
      return (
        <ProductForm
          product={editingProduct}
          onSave={async (productData) => {
            try {
              if (editingProduct) {
                const updatedProduct = await dataService.updateProduct(editingProduct.id, productData, user.id);
                setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
                toast({ title: "Product updated successfully" });
              } else {
                const newProduct = await dataService.createProduct(productData, user.id);
                setProducts([...products, newProduct]);
                toast({ title: "Product created successfully" });
              }
              setIsProductFormOpen(false);
              setEditingProduct(undefined);
            } catch (error) {
              toast({ title: "Error saving product", variant: "destructive" });
            }
          }}
          onCancel={() => {
            setIsProductFormOpen(false);
            setEditingProduct(undefined);
          }}
          isEditing={!!editingProduct}
        />
      );
    }

    if (isServiceFormOpen) {
      return (
        <ServiceForm
          service={editingService}
          onSave={async (serviceData) => {
            try {
              if (editingService) {
                const updatedService = await dataService.updateService(editingService.id, serviceData, user.id);
                setServices(services.map(s => s.id === editingService.id ? updatedService : s));
                toast({ title: "Service updated successfully" });
              } else {
                const newService = await dataService.createService(serviceData, user.id);
                setServices([...services, newService]);
                toast({ title: "Service created successfully" });
              }
              setIsServiceFormOpen(false);
              setEditingService(undefined);
            } catch (error) {
              toast({ title: "Error saving service", variant: "destructive" });
            }
          }}
          onCancel={() => {
            setIsServiceFormOpen(false);
            setEditingService(undefined);
          }}
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
          onSave={handleSaveInvoice}
          onCancel={handleCancelInvoice}
          isEditing={!!editingInvoice}
          currency={currency}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} products={products} services={services} invoices={invoices} currency={currency} />;
      case 'clients':
        return (
          <ClientList
            clients={clients}
            onAddClient={() => setIsClientFormOpen(true)}
            onEditClient={(client) => {
              setEditingClient(client);
              setIsClientFormOpen(true);
            }}
            onDeleteClient={handleDeleteClient}
            currency={currency}
          />
        );
      case 'products':
        return (
          <ProductList
            products={products}
            onAddProduct={() => setIsProductFormOpen(true)}
            onEditProduct={(product) => {
              setEditingProduct(product);
              setIsProductFormOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            currency={currency}
          />
        );
      case 'services':
        return (
          <ServiceList
            services={services}
            onAddService={() => setIsServiceFormOpen(true)}
            onEditService={(service) => {
              setEditingService(service);
              setIsServiceFormOpen(true);
            }}
            onDeleteService={handleDeleteService}
            currency={currency}
          />
        );
      case 'invoices':
        return (
          <InvoiceList
            invoices={invoices}
            clients={clients}
            onAddInvoice={handleCreateInvoice}
            onEditInvoice={handleEditInvoice}
            onViewInvoice={handleViewInvoice}
            currency={currency}
          />
        );
      case 'analytics':
        return <Analytics invoices={invoices} clients={clients} products={products} services={services} currency={currency} />;
      case 'ai-assistant':
        return (
          <AIAssistant
            onCreateClient={handleAICreateClient}
            onCreateProduct={handleAICreateProduct}
            onCreateService={handleAICreateService}
            onCreateInvoice={handleAICreateInvoice}
            clients={clients}
            currency={currency}
          />
        );
      case 'settings':
        return <Settings currency={currency} currencies={CURRENCIES} onCurrencyChange={handleCurrencyChange} />;
      default:
        return <Dashboard clients={clients} products={products} services={services} invoices={invoices} currency={currency} />;
    }
  };

  return (
    <MobileLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </MobileLayout>
  );
};

export default BusinessApp;
