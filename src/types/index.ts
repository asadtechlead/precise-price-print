
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  balance: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stockQuantity?: number;
  trackStock: boolean;
  category: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  category: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  type: 'product' | 'service';
  productId?: string;
  serviceId?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  notes?: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface DashboardStats {
  totalPending: number;
  totalEarned: number;
  totalClients: number;
  totalInvoices: number;
  overdueAmount: number;
  thisMonthEarnings: number;
}
