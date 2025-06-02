
import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/Layout/MobileLayout';
import Dashboard from '@/components/Dashboard/Dashboard';
import ClientList from '@/components/Clients/ClientList';
import ClientForm from '@/components/Clients/ClientForm';
import ProductList from '@/components/Products/ProductList';
import ProductForm from '@/components/Products/ProductForm';
import { Client, Product, DashboardStats, Currency } from '@/types';

const CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const BusinessApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currency] = useState<Currency>(CURRENCIES[0]); // PKR as default
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock dashboard stats
  const [dashboardStats] = useState<DashboardStats>({
    totalPending: 125000,
    totalEarned: 450000,
    totalClients: clients.length,
    totalInvoices: 45,
    overdueAmount: 25000,
    thisMonthEarnings: 85000,
  });

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
      // Update existing client
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...clientData, id: editingClient.id, createdAt: editingClient.createdAt }
          : client
      ));
    } else {
      // Add new client
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
      // Update existing product
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id, createdAt: editingProduct.createdAt }
          : product
      ));
    } else {
      // Add new product
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

  const renderCurrentPage = () => {
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
      case 'invoices':
        return <div className="p-4">Invoices page - Coming soon</div>;
      case 'analytics':
        return <div className="p-4">Analytics page - Coming soon</div>;
      case 'settings':
        return <div className="p-4">Settings page - Coming soon</div>;
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
