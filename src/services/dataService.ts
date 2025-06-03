
import { supabase } from '@/lib/supabase';
import { Client, Product, Service, Invoice } from '@/types';
import { useAuth } from '@/hooks/useAuth';

class DataService {
  // Clients
  async getClients(userId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>, userId: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateClient(id: string, client: Partial<Client>, userId: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteClient(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // Products
  async getProducts(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>, userId: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...product, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProduct(id: string, product: Partial<Product>, userId: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteProduct(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // Services
  async getServices(userId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  async createService(service: Omit<Service, 'id' | 'createdAt'>, userId: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert([{ ...service, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateService(id: string, service: Partial<Service>, userId: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteService(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // Invoices
  async getInvoices(userId: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>, userId: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .insert([{ ...invoice, user_id: userId, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>, userId: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteInvoice(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // Email functionality
  async sendInvoiceEmail(invoiceId: string, clientEmail: string, userId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('send-invoice-email', {
      body: { invoiceId, clientEmail, userId }
    });
    
    if (error) throw error;
  }
}

export const dataService = new DataService();
