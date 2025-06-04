import React from 'react';
import { LayoutDashboard, Users, Package, Briefcase, FileText, BarChart3, Settings, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Common/Logo';

interface DesktopLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children, currentPage, onNavigate }) => {
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <Logo className="text-lg" />
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'flex items-center w-full px-3 py-2 text-sm rounded-md',
                      'transition-colors duration-200',
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex-shrink-0 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-900">
            {navItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
