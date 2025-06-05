
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import ContactUs from '@/pages/ContactUs';
import FAQs from '@/pages/FAQs';
import NotFound from '@/pages/NotFound';
import BusinessApp from '@/pages/BusinessApp';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthForm from '@/components/Auth/AuthForm';
import ForgotPassword from '@/components/Auth/ForgotPassword';
import './App.css';

// Protected route component - only allows access when user is authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Public route component - only allows access when user is not authenticated
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faqs" element={<FAQs />} />
            
            {/* Auth routes - only accessible when not logged in */}
            <Route path="/auth" element={
              <PublicRoute>
                <AuthForm />
              </PublicRoute>
            } />
            
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            
            {/* Protected routes - only accessible when logged in */}
            <Route path="/app/*" element={
              <ProtectedRoute>
                <BusinessApp />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
