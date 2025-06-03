
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface DatabaseClient {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  balance: number;
  created_at: string;
}

export interface DatabaseProduct {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock_quantity?: number;
  track_stock: boolean;
  category: string;
  created_at: string;
}

export interface DatabaseService {
  id: string;
  user_id: string;
  name: string;
  description: string;
  hourly_rate: number;
  category: string;
  created_at: string;
}

export interface DatabaseInvoice {
  id: string;
  user_id: string;
  invoice_number: string;
  client_id: string;
  items: any[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  paid_at?: string;
  notes?: string;
}
