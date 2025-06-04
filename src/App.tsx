
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import ContactUs from '@/pages/ContactUs';
import FAQs from '@/pages/FAQs';
import NotFound from '@/pages/NotFound';
import BusinessApp from '@/pages/BusinessApp';
import { AuthProvider } from '@/hooks/useAuth';
import './App.css';

function App() {
  useEffect(() => {
    // Check for dark mode preference
    const theme = localStorage.getItem('invoicepro_theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/app/*" element={<BusinessApp />} />
          <Route path="/auth" element={<BusinessApp />} />
          <Route path="/forgot-password" element={<BusinessApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
