
import { supabase } from '@/integrations/supabase/client';
import { Client, Product, Service, Invoice, InvoiceItem } from '@/types';

// Helper function to safely cast Json to InvoiceItem[]
const parseInvoiceItems = (items: any): InvoiceItem[] => {
  if (!items) return [];
  if (!Array.isArray(items)) return [];
  
  return items.map(item => ({
    id: item.id || '',
    type: item.type || 'product',
    productId: item.productId,
    serviceId: item.serviceId,
    description: item.description || '',
    quantity: Number(item.quantity) || 0,
    rate: Number(item.rate) || 0,
    amount: Number(item.amount) || 0
  }));
};

class DataService {
  // User Profile
  async updateUserProfile(userId: string, userData: {
    email?: string;
    password?: string;
    data?: Record<string, any>;
  }): Promise<void> {
    console.log('Updating user profile:', userId, userData);
    
    if (userData.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: userData.email
      });
      
      if (emailError) {
        console.error('Error updating email:', emailError);
        throw emailError;
      }
    }
    
    if (userData.password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: userData.password
      });
      
      if (passwordError) {
        console.error('Error updating password:', passwordError);
        throw passwordError;
      }
    }
    
    if (userData.data) {
      const { error: dataError } = await supabase.auth.updateUser({
        data: userData.data
      });
      
      if (dataError) {
        console.error('Error updating user data:', dataError);
        throw dataError;
      }
    }
    
    console.log('User profile updated successfully');
  }

  // Password reset
  async resetPassword(email: string): Promise<void> {
    console.log('Resetting password for:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
    
    console.log('Password reset email sent successfully');
  }

  // Sign out
  async signOut(): Promise<void> {
    console.log('Signing out user');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    console.log('User signed out successfully');
  }

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
    
    // Map database fields to our Client type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone || '',
      address: item.address || '',
      city: item.city || '',
      state: item.state || '',
      zip: item.zip || '',
      balance: Number(item.balance) || 0,
      createdAt: item.created_at
    }));
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>, userId: string): Promise<Client> {
    console.log('Creating client for user:', userId, client);
    const { data, error } = await supabase
      .from('clients')
      .insert([{ 
        ...client, 
        user_id: userId, 
        created_at: new Date().toISOString(),
        phone: client.phone || null,
        address: client.address || null,
        city: client.city || null,
        state: client.state || null,
        zip: client.zip || null,
        balance: client.balance || 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }
    console.log('Client created:', data);
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zip: data.zip || '',
      balance: Number(data.balance) || 0,
      createdAt: data.created_at
    };
  }

  async updateClient(id: string, client: Partial<Client>, userId: string): Promise<Client> {
    console.log('Updating client:', id, client);
    const updateData: any = { ...client };
    delete updateData.id;
    delete updateData.createdAt;
    
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }
    console.log('Client updated:', data);
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zip: data.zip || '',
      balance: Number(data.balance) || 0,
      createdAt: data.created_at
    };
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
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: Number(item.price),
      unit: item.unit,
      stockQuantity: item.stock_quantity,
      trackStock: item.track_stock || false,
      category: item.category || '',
      createdAt: item.created_at
    }));
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>, userId: string): Promise<Product> {
    console.log('Creating product for user:', userId, product);
    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        name: product.name,
        description: product.description || null,
        price: product.price,
        unit: product.unit,
        stock_quantity: product.stockQuantity || null,
        track_stock: product.trackStock || false,
        category: product.category || null,
        user_id: userId, 
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    console.log('Product created:', data);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      unit: data.unit,
      stockQuantity: data.stock_quantity,
      trackStock: data.track_stock || false,
      category: data.category || '',
      createdAt: data.created_at
    };
  }

  async updateProduct(id: string, product: Partial<Product>, userId: string): Promise<Product> {
    console.log('Updating product:', id, product);
    const updateData: any = {};
    
    if (product.name !== undefined) updateData.name = product.name;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.unit !== undefined) updateData.unit = product.unit;
    if (product.stockQuantity !== undefined) updateData.stock_quantity = product.stockQuantity;
    if (product.trackStock !== undefined) updateData.track_stock = product.trackStock;
    if (product.category !== undefined) updateData.category = product.category;
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    console.log('Product updated:', data);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      unit: data.unit,
      stockQuantity: data.stock_quantity,
      trackStock: data.track_stock || false,
      category: data.category || '',
      createdAt: data.created_at
    };
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
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      hourlyRate: Number(item.hourly_rate),
      category: item.category || '',
      createdAt: item.created_at
    }));
  }

  async createService(service: Omit<Service, 'id' | 'createdAt'>, userId: string): Promise<Service> {
    console.log('Creating service for user:', userId, service);
    const { data, error } = await supabase
      .from('services')
      .insert([{ 
        name: service.name,
        description: service.description || null,
        hourly_rate: service.hourlyRate,
        category: service.category || null,
        user_id: userId, 
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    console.log('Service created:', data);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      hourlyRate: Number(data.hourly_rate),
      category: data.category || '',
      createdAt: data.created_at
    };
  }

  async updateService(id: string, service: Partial<Service>, userId: string): Promise<Service> {
    console.log('Updating service:', id, service);
    const updateData: any = {};
    
    if (service.name !== undefined) updateData.name = service.name;
    if (service.description !== undefined) updateData.description = service.description;
    if (service.hourlyRate !== undefined) updateData.hourly_rate = service.hourlyRate;
    if (service.category !== undefined) updateData.category = service.category;
    
    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }
    console.log('Service updated:', data);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      hourlyRate: Number(data.hourly_rate),
      category: data.category || '',
      createdAt: data.created_at
    };
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
    
    return (data || []).map(item => ({
      id: item.id,
      invoiceNumber: item.invoice_number,
      clientId: item.client_id,
      items: parseInvoiceItems(item.items),
      subtotal: Number(item.subtotal),
      taxRate: Number(item.tax_rate),
      taxAmount: Number(item.tax_amount),
      total: Number(item.total),
      status: item.status as 'draft' | 'sent' | 'paid' | 'overdue',
      dueDate: item.due_date,
      createdAt: item.created_at,
      paidAt: item.paid_at || undefined,
      notes: item.notes || undefined
    }));
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>, userId: string): Promise<Invoice> {
    console.log('Creating invoice for user:', userId, invoice);
    const { data, error } = await supabase
      .from('invoices')
      .insert([{ 
        invoice_number: invoice.invoiceNumber,
        client_id: invoice.clientId,
        items: invoice.items as any, // Cast to any for Json compatibility
        subtotal: invoice.subtotal,
        tax_rate: invoice.taxRate,
        tax_amount: invoice.taxAmount,
        total: invoice.total,
        status: invoice.status,
        due_date: invoice.dueDate,
        paid_at: invoice.paidAt || null,
        notes: invoice.notes || null,
        user_id: userId, 
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
    console.log('Invoice created:', data);
    
    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      clientId: data.client_id,
      items: parseInvoiceItems(data.items),
      subtotal: Number(data.subtotal),
      taxRate: Number(data.tax_rate),
      taxAmount: Number(data.tax_amount),
      total: Number(data.total),
      status: data.status as 'draft' | 'sent' | 'paid' | 'overdue',
      dueDate: data.due_date,
      createdAt: data.created_at,
      paidAt: data.paid_at || undefined,
      notes: data.notes || undefined
    };
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>, userId: string): Promise<Invoice> {
    console.log('Updating invoice:', id, invoice);
    const updateData: any = {};
    
    if (invoice.invoiceNumber !== undefined) updateData.invoice_number = invoice.invoiceNumber;
    if (invoice.clientId !== undefined) updateData.client_id = invoice.clientId;
    if (invoice.items !== undefined) updateData.items = invoice.items as any; // Cast to any for Json compatibility
    if (invoice.subtotal !== undefined) updateData.subtotal = invoice.subtotal;
    if (invoice.taxRate !== undefined) updateData.tax_rate = invoice.taxRate;
    if (invoice.taxAmount !== undefined) updateData.tax_amount = invoice.taxAmount;
    if (invoice.total !== undefined) updateData.total = invoice.total;
    if (invoice.status !== undefined) updateData.status = invoice.status;
    if (invoice.dueDate !== undefined) updateData.due_date = invoice.dueDate;
    if (invoice.paidAt !== undefined) updateData.paid_at = invoice.paidAt;
    if (invoice.notes !== undefined) updateData.notes = invoice.notes;
    
    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
    console.log('Invoice updated:', data);
    
    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      clientId: data.client_id,
      items: parseInvoiceItems(data.items),
      subtotal: Number(data.subtotal),
      taxRate: Number(data.tax_rate),
      taxAmount: Number(data.tax_amount),
      total: Number(data.total),
      status: data.status as 'draft' | 'sent' | 'paid' | 'overdue',
      dueDate: data.due_date,
      createdAt: data.created_at,
      paidAt: data.paid_at || undefined,
      notes: data.notes || undefined
    };
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
