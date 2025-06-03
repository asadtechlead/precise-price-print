
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Shield, Zap, Users, Download, Mail, ArrowRight, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Professional Invoices",
      description: "Create beautiful, professional invoices with customizable templates and branding."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security and automatic backups."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate invoices in seconds with our intuitive and streamlined interface."
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Keep track of all your clients, their contact information, and payment history."
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Download PDFs, print invoices, or email them directly to your clients."
    },
    {
      icon: Mail,
      title: "Email Integration",
      description: "Send invoices and payment reminders directly through the platform."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content: "InvoicePro has streamlined my billing process completely. I can create and send professional invoices in minutes!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      content: "The client management features are fantastic. I can track all my customers and their payment history in one place.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Consultant",
      content: "The email reminders feature has improved my cash flow significantly. Highly recommended!",
      rating: 5
    }
  ];

  const pricingFeatures = [
    "Unlimited invoices",
    "Client management",
    "PDF export",
    "Email integration",
    "Payment tracking",
    "Mobile responsive",
    "Cloud sync",
    "24/7 support"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">InvoicePro</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/app')} variant="outline">
                Try Free Invoice
              </Button>
              <Button onClick={() => navigate('/app')} className="bg-blue-600 hover:bg-blue-700">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Invoicing
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, send, and track invoices with ease. InvoicePro helps small businesses and freelancers get paid faster with professional invoicing tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/app')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/app')}
              className="text-lg px-8 py-3"
            >
              Try Free Invoice
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage invoices
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From creating professional invoices to tracking payments, InvoicePro has all the tools you need to streamline your billing process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by thousands of businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about InvoicePro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Start free and upgrade as you grow
          </p>
          <div className="max-w-lg mx-auto">
            <Card className="p-8 border-2 border-blue-600">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
                  <p className="text-gray-600">Perfect for getting started</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  size="lg"
                  onClick={() => navigate('/app')}
                >
                  Get Started Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust InvoicePro to manage their invoicing and get paid faster.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/app')}
            className="text-lg px-8 py-3"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
