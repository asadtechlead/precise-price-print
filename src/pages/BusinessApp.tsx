
import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/Layout/MobileLayout';
import Dashboard from '@/components/Dashboard/Dashboard';
import ClientList from '@/components/Clients/ClientList';
import { Client, DashboardStats, Currency } from '@/types';

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

  // Mock dashboard stats
  const [dashboardStats] = useState<DashboardStats>({
    totalPending: 125000,
    totalEarned: 450000,
    totalClients: 15,
    totalInvoices: 45,
    overdueAmount: 25000,
    thisMonthEarnings: 85000,
  });

  const handleAddClient = () => {
    console.log('Add client');
  };

  const handleEditClient = (client: Client) => {
    console.log('Edit client:', client);
  };

  const handleViewClient = (client: Client) => {
    console.log('View client:', client);
  };

  const renderCurrentPage = () => {
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
      case 'invoices':
        return <div className="p-4">Invoices page - Coming soon</div>;
      case 'products':
        return <div className="p-4">Products page - Coming soon</div>;
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
