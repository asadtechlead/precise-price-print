
import { supabase } from '@/integrations/supabase/client';
import { Client, Product, Service, Invoice } from '@/types';

class DataService {
  // Clients
  async getClients(userId: string): Promise<Client[]> {
    console.log('Fetching clients for user:', userId);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    console.log('Clients fetched:', data?.length || 0);
    return data || [];
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>, userId: string): Promise<Client> {
    console.log('Creating client for user:', userId, client);
    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }
    console.log('Client created:', data);
    return data;
  }

  async updateClient(id: string, client: Partial<Client>, userId: string): Promise<Client> {
    console.log('Updating client:', id, client);
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }
    console.log('Client updated:', data);
    return data;
  }

  async deleteClient(id: string, userId: string): Promise<void> {
    console.log('Deleting client:', id);
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
    console.log('Client deleted successfully');
  }

  // Products
  async getProducts(userId: string): Promise<Product[]> {
    console.log('Fetching products for user:', userId);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    console.log('Products fetched:', data?.length || 0);
    return data || [];
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>, userId: string): Promise<Product> {
    console.log('Creating product for user:', userId, product);
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...product, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    console.log('Product created:', data);
    return data;
  }

  async updateProduct(id: string, product: Partial<Product>, userId: string): Promise<Product> {
    console.log('Updating product:', id, product);
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    console.log('Product updated:', data);
    return data;
  }

  async deleteProduct(id: string, userId: string): Promise<void> {
    console.log('Deleting product:', id);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    console.log('Product deleted successfully');
  }

  // Services
  async getServices(userId: string): Promise<Service[]> {
    console.log('Fetching services for user:', userId);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    console.log('Services fetched:', data?.length || 0);
    return data || [];
  }

  async createService(service: Omit<Service, 'id' | 'createdAt'>, userId: string): Promise<Service> {
    console.log('Creating service for user:', userId, service);
    const { data, error } = await supabase
      .from('services')
      .insert([{ ...service, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    console.log('Service created:', data);
    return data;
  }

  async updateService(id: string, service: Partial<Service>, userId: string): Promise<Service> {
    console.log('Updating service:', id, service);
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }
    console.log('Service updated:', data);
    return data;
  }

  async deleteService(id: string, userId: string): Promise<void> {
    console.log('Deleting service:', id);
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
    console.log('Service deleted successfully');
  }

  // Invoices
  async getInvoices(userId: string): Promise<Invoice[]> {
    console.log('Fetching invoices for user:', userId);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
    console.log('Invoices fetched:', data?.length || 0);
    return data || [];
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>, userId: string): Promise<Invoice> {
    console.log('Creating invoice for user:', userId, invoice);
    const { data, error } = await supabase
      .from('invoices')
      .insert([{ ...invoice, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
    console.log('Invoice created:', data);
    return data;
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>, userId: string): Promise<Invoice> {
    console.log('Updating invoice:', id, invoice);
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
    console.log('Invoice updated:', data);
    return data;
  }

  async deleteInvoice(id: string, userId: string): Promise<void> {
    console.log('Deleting invoice:', id);
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
    console.log('Invoice deleted successfully');
  }

  // Email functionality
  async sendInvoiceEmail(invoiceId: string, clientEmail: string, userId: string): Promise<void> {
    console.log('Sending invoice email:', invoiceId, clientEmail);
    const { error } = await supabase.functions.invoke('send-invoice-email', {
      body: { invoiceId, clientEmail, userId }
    });
    
    if (error) {
      console.error('Error sending invoice email:', error);
      throw error;
    }
    console.log('Invoice email sent successfully');
  }
}

export const dataService = new DataService();
