
import { Client, Product, Service, Invoice } from '@/types';

export const sampleClients: Client[] = [
  // {
  //   id: '1',
  //   name: 'ABC Corporation',
  //   email: 'contact@abccorp.com',
  //   phone: '+92-300-1234567',
  //   address: '123 Business Street',
  //   city: 'Karachi',
  //   state: 'Sindh',
  //   zip: '75400',
  //   balance: 15000,
  //   createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  // },
  // {
  //   id: '2',
  //   name: 'Tech Solutions Ltd',
  //   email: 'info@techsolutions.com',
  //   phone: '+92-321-9876543',
  //   address: '456 Innovation Avenue',
  //   city: 'Lahore',
  //   state: 'Punjab',
  //   zip: '54000',
  //   balance: -5000,
  //   createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  // },
];

export const sampleProducts: Product[] = [
  // {
  //   id: '1',
  //   name: 'Website Development',
  //   description: 'Custom website development with modern design',
  //   price: 50000,
  //   unit: 'project',
  //   stockQuantity: 0,
  //   trackStock: false,
  //   category: 'Web Development',
  //   createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  // },
  // {
  //   id: '2',
  //   name: 'Mobile App',
  //   description: 'Native mobile application development',
  //   price: 100000,
  //   unit: 'project',
  //   stockQuantity: 0,
  //   trackStock: false,
  //   category: 'Mobile Development',
  //   createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  // },
];

export const sampleServices: Service[] = [
  // {
  //   id: '1',
  //   name: 'Consulting',
  //   description: 'Business and technology consulting services',
  //   hourlyRate: 2500,
  //   category: 'Consulting',
  //   createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  // },
  // {
  //   id: '2',
  //   name: 'Design Services',
  //   description: 'UI/UX design and branding services',
  //   hourlyRate: 2000,
  //   category: 'Design',
  //   createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  // },
];

export const sampleInvoices: Invoice[] = [
  // {
  //   id: '1',
  //   invoiceNumber: 'INV-001',
  //   clientId: '1',
  //   items: [
  //     {
  //       id: '1',
  //       type: 'product',
  //       productId: '1',
  //       description: 'Website Development',
  //       quantity: 1,
  //       rate: 50000,
  //       amount: 50000,
  //     },
  //   ],
  //   subtotal: 50000,
  //   taxRate: 17,
  //   taxAmount: 8500,
  //   total: 58500,
  //   status: 'paid',
  //   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  //   createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  //   paidAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  //   notes: 'Thank you for your business!',
  // },
  // {
  //   id: '2',
  //   invoiceNumber: 'INV-002',
  //   clientId: '2',
  //   items: [
  //     {
  //       id: '1',
  //       type: 'service',
  //       serviceId: '1',
  //       description: 'Consulting Services',
  //       quantity: 40,
  //       rate: 2500,
  //       amount: 100000,
  //     },
  //   ],
  //   subtotal: 100000,
  //   taxRate: 17,
  //   taxAmount: 17000,
  //   total: 117000,
  //   status: 'sent',
  //   dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  //   createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  //   notes: 'Payment due within 30 days',
  // },
];
