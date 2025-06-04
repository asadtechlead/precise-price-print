
import React, { useState } from 'react';
import { LayoutDashboard, Users, Package, Briefcase, FileText, BarChart3, Settings, Bot, Menu, X } from 'lucide-react';
import Logo from '@/components/Common/Logo';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const MobileLayout = ({ children, currentPage, onNavigate }: MobileLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Split nav items into primary (bottom bar) and secondary (menu)
  const primaryNavItems = navItems.slice(0, 4);
  const secondaryNavItems = navItems.slice(4);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Logo withText={false} className="mr-2" />
            <h1 className="text-xl font-bold text-gray-900">InvoicePro</h1>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-2">
            <div className="grid grid-cols-2 gap-2">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center p-3 rounded-md w-full text-left ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-1 shadow-lg z-40">
        <div className="flex justify-around">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center p-2 min-w-0 flex-1 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
