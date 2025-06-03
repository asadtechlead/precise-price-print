
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ArrowLeft, Users, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "We prioritize our customers' success and build features that solve real business problems."
    },
    {
      icon: Target,
      title: "Simplicity",
      description: "We believe powerful tools should be simple to use. Complexity shouldn't get in the way of productivity."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from product design to customer support."
    }
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
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About InvoicePro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to simplify invoicing for small businesses and freelancers worldwide. 
            InvoicePro was born from the frustration of dealing with complex, expensive invoicing software.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed mb-6">
              InvoicePro was founded in 2024 with a simple vision: make professional invoicing accessible to everyone. 
              As small business owners ourselves, we experienced firsthand the challenges of managing invoices, 
              tracking payments, and maintaining professional relationships with clients.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Existing solutions were either too complex, too expensive, or lacked the features that modern 
              businesses need. We decided to build something different – a platform that combines powerful 
              functionality with intuitive design, all while keeping it affordable for businesses of any size.
            </p>
            <p className="text-lg leading-relaxed">
              Today, InvoicePro serves thousands of businesses worldwide, from solo freelancers to growing 
              companies. We're proud to be part of their success stories and continue to innovate based on 
              their feedback and needs.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at InvoicePro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-8">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            To empower small businesses and freelancers with simple, powerful invoicing tools that help them 
            get paid faster, manage their finances better, and focus on what they do best – serving their customers.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/app')}
            className="text-lg px-8 py-3"
          >
            Join Our Mission
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
