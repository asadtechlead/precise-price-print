
import { useState, useEffect } from 'react';
import { dataService } from '@/services/dataService';
import { sampleClients, sampleProducts, sampleServices, sampleInvoices } from '@/utils/sampleData';
import { Client, Product, Service, Invoice, Currency, DashboardStats } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface UseBusinessDataProps {
  user: any;
  loading: boolean;
}

export const useBusinessData = ({ user, loading }: UseBusinessDataProps) => {
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Calculate dashboard statistics
  const calculateDashboardStats = (): DashboardStats => {
    const totalPending = invoices
      .filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.total, 0);

    const totalEarned = invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);

    const overdueAmount = invoices
      .filter(invoice => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.total, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthEarnings = invoices
      .filter(invoice => {
        if (invoice.status !== 'paid' || !invoice.paidAt) return false;
        const paidDate = new Date(invoice.paidAt);
        return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
      })
      .reduce((sum, invoice) => sum + invoice.total, 0);

    return {
      totalPending,
      totalEarned,
      totalClients: clients.length,
      totalInvoices: invoices.length,
      overdueAmount,
      thisMonthEarnings,
    };
  };

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

      setClients(savedClients ? JSON.parse(savedClients) : sampleClients);
      setProducts(savedProducts ? JSON.parse(savedProducts) : sampleProducts);
      setServices(savedServices ? JSON.parse(savedServices) : sampleServices);
      setInvoices(savedInvoices ? JSON.parse(savedInvoices) : sampleInvoices);
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

  // Data operations with proper error handling
  const handleDeleteClient = async (id: string) => {
    try {
      if (user) {
        await dataService.deleteClient(id, user.id);
        setClients(clients.filter(c => c.id !== id));
        toast({ title: "Client deleted successfully" });
      } else {
        // Handle localStorage deletion for non-authenticated users
        const updatedClients = clients.filter(c => c.id !== id);
        setClients(updatedClients);
        localStorage.setItem('invoicepro_clients', JSON.stringify(updatedClients));
        toast({ title: "Client deleted successfully" });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({ title: "Error deleting client", variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      if (user) {
        await dataService.deleteProduct(id, user.id);
        setProducts(products.filter(p => p.id !== id));
        toast({ title: "Product deleted successfully" });
      } else {
        // Handle localStorage deletion for non-authenticated users
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        localStorage.setItem('invoicepro_products', JSON.stringify(updatedProducts));
        toast({ title: "Product deleted successfully" });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      if (user) {
        await dataService.deleteService(id, user.id);
        setServices(services.filter(s => s.id !== id));
        toast({ title: "Service deleted successfully" });
      } else {
        // Handle localStorage deletion for non-authenticated users
        const updatedServices = services.filter(s => s.id !== id);
        setServices(updatedServices);
        localStorage.setItem('invoicepro_services', JSON.stringify(updatedServices));
        toast({ title: "Service deleted successfully" });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({ title: "Error deleting service", variant: "destructive" });
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      if (user) {
        await dataService.deleteInvoice(id, user.id);
        setInvoices(invoices.filter(i => i.id !== id));
        toast({ title: "Invoice deleted successfully" });
      } else {
        // Handle localStorage deletion for non-authenticated users
        const updatedInvoices = invoices.filter(i => i.id !== id);
        setInvoices(updatedInvoices);
        localStorage.setItem('invoicepro_invoices', JSON.stringify(updatedInvoices));
        toast({ title: "Invoice deleted successfully" });
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({ title: "Error deleting invoice", variant: "destructive" });
    }
  };

  // AI Assistant handlers with proper user check
  const handleAICreateClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      if (user) {
        const newClient = await dataService.createClient(clientData, user.id);
        setClients([...clients, newClient]);
      } else {
        // Handle localStorage creation for non-authenticated users
        const newClient: Client = {
          ...clientData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        const updatedClients = [...clients, newClient];
        setClients(updatedClients);
        localStorage.setItem('invoicepro_clients', JSON.stringify(updatedClients));
      }
    } catch (error) {
      console.error('Error creating client:', error);
      toast({ title: "Error creating client", variant: "destructive" });
    }
  };

  const handleAICreateProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      if (user) {
        const newProduct = await dataService.createProduct(productData, user.id);
        setProducts([...products, newProduct]);
      } else {
        // Handle localStorage creation for non-authenticated users
        const newProduct: Product = {
          ...productData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        localStorage.setItem('invoicepro_products', JSON.stringify(updatedProducts));
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({ title: "Error creating product", variant: "destructive" });
    }
  };

  const handleAICreateService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    try {
      if (user) {
        const newService = await dataService.createService(serviceData, user.id);
        setServices([...services, newService]);
      } else {
        // Handle localStorage creation for non-authenticated users
        const newService: Service = {
          ...serviceData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        const updatedServices = [...services, newService];
        setServices(updatedServices);
        localStorage.setItem('invoicepro_services', JSON.stringify(updatedServices));
      }
    } catch (error) {
      console.error('Error creating service:', error);
      toast({ title: "Error creating service", variant: "destructive" });
    }
  };

  const handleAICreateInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    try {
      if (user) {
        const newInvoice = await dataService.createInvoice(invoiceData, user.id);
        setInvoices([...invoices, newInvoice]);
      } else {
        // Handle localStorage creation for non-authenticated users
        const newInvoice: Invoice = {
          ...invoiceData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        const updatedInvoices = [...invoices, newInvoice];
        setInvoices(updatedInvoices);
        localStorage.setItem('invoicepro_invoices', JSON.stringify(updatedInvoices));
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({ title: "Error creating invoice", variant: "destructive" });
    }
  };

  return {
    clients,
    products,
    services,
    invoices,
    setClients,
    setProducts,
    setServices,
    setInvoices,
    calculateDashboardStats,
    handleDeleteClient,
    handleDeleteProduct,
    handleDeleteService,
    handleDeleteInvoice,
    handleAICreateClient,
    handleAICreateProduct,
    handleAICreateService,
    handleAICreateInvoice,
  };
};
