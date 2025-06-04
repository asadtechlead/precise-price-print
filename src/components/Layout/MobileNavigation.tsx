import React from 'react';
import { Home, Users, FileText, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
    { id: 'ai-assistant', icon: Bot, label: 'AI' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg py-2 px-1 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-2 min-w-0 flex-1 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
