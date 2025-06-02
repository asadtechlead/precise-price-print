
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Calendar } from 'lucide-react';
import { Invoice, Client, Product, Service } from '@/types';

interface AnalyticsProps {
  invoices: Invoice[];
  clients: Client[];
  products: Product[];
  services: Service[];
  currency: { symbol: string };
}

const Analytics = ({ invoices, clients, products, services, currency }: AnalyticsProps) => {
  const formatCurrency = (amount: number) => `${currency.symbol}${amount.toLocaleString()}`;

  // Calculate metrics
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0);
  const overdueRevenue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
  
  // Monthly revenue data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleString('default', { month: 'short' });
    const monthInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      return invDate.getMonth() === date.getMonth() && 
             invDate.getFullYear() === date.getFullYear() &&
             inv.status === 'paid';
    });
    const revenue = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
    return { month, revenue };
  });

  // Invoice status distribution
  const statusData = [
    { name: 'Paid', value: invoices.filter(inv => inv.status === 'paid').length, color: '#10B981' },
    { name: 'Sent', value: invoices.filter(inv => inv.status === 'sent').length, color: '#3B82F6' },
    { name: 'Draft', value: invoices.filter(inv => inv.status === 'draft').length, color: '#6B7280' },
    { name: 'Overdue', value: invoices.filter(inv => inv.status === 'overdue').length, color: '#EF4444' },
  ];

  // Top clients by revenue
  const clientRevenue = clients.map(client => {
    const clientInvoices = invoices.filter(inv => inv.clientId === client.id && inv.status === 'paid');
    const revenue = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
    return { name: client.name, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Product/Service performance
  const productPerformance = products.map(product => {
    const productItems = invoices.flatMap(inv => 
      inv.items.filter(item => item.productId === product.id && inv.status === 'paid')
    );
    const quantity = productItems.reduce((sum, item) => sum + item.quantity, 0);
    const revenue = productItems.reduce((sum, item) => sum + item.amount, 0);
    return { name: product.name, quantity, revenue, type: 'Product' };
  });

  const servicePerformance = services.map(service => {
    const serviceItems = invoices.flatMap(inv => 
      inv.items.filter(item => item.serviceId === service.id && inv.status === 'paid')
    );
    const hours = serviceItems.reduce((sum, item) => sum + item.quantity, 0);
    const revenue = serviceItems.reduce((sum, item) => sum + item.amount, 0);
    return { name: service.name, quantity: hours, revenue, type: 'Service' };
  });

  const topItems = [...productPerformance, ...servicePerformance]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1 sm:mt-0">
          Business insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">From paid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(pendingRevenue)}
            </div>
            <p className="text-xs text-gray-500">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(overdueRevenue)}
            </div>
            <p className="text-xs text-gray-500">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {invoices.length}
            </div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientRevenue} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products/Services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products & Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                <Bar dataKey="revenue" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
