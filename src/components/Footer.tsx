
import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Need Custom Development or Software Solutions?</h3>
          <p className="text-gray-300 mb-6">
            Contact me for professional web development, custom software solutions, and business applications.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Asad Mahmood</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <a 
                href="tel:03084618263" 
                className="hover:text-blue-400 transition-colors"
              >
                03084618263
              </a>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a 
                href="mailto:asadtechlead@gmail.com" 
                className="hover:text-blue-400 transition-colors"
              >
                asadtechlead@gmail.com
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-400">
            <p>&copy; 2024 Asad Mahmood. Available for freelance projects and custom development.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
