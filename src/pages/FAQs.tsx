
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileText, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const FAQs = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first invoice?",
          answer: "Creating your first invoice is easy! Simply click on 'Get Started' or 'Try Free Invoice' from the homepage, fill in your company details, add your client information, and list your products or services. InvoicePro will generate a professional invoice that you can download as PDF or email directly to your client."
        },
        {
          question: "Do I need to create an account to use InvoicePro?",
          answer: "You can create and download invoices without an account for free. However, creating an account allows you to save your data, manage multiple clients, track payment history, and access advanced features like automatic email reminders."
        },
        {
          question: "Is InvoicePro really free?",
          answer: "Yes! InvoicePro offers a completely free plan that includes unlimited invoices, client management, PDF export, and basic features. We believe every business should have access to professional invoicing tools regardless of their size or budget."
        }
      ]
    },
    {
      category: "Features",
      questions: [
        {
          question: "Can I customize my invoice template?",
          answer: "Yes! InvoicePro allows you to customize your invoices with your company logo, colors, and branding. You can also add custom fields, payment terms, and notes to match your business needs."
        },
        {
          question: "How do I send invoices to my clients?",
          answer: "You can send invoices in multiple ways: download as PDF and email manually, use our built-in email feature to send directly from the platform, or share a link to view the invoice online. All methods ensure your clients receive professional-looking invoices."
        },
        {
          question: "Can I track when my invoices are paid?",
          answer: "Absolutely! InvoicePro includes payment tracking features. You can mark invoices as paid, track outstanding amounts, and see your payment history. The dashboard gives you a clear overview of your financial status."
        },
        {
          question: "Do you support multiple currencies?",
          answer: "Yes! InvoicePro supports multiple currencies including USD, EUR, GBP, PKR, AED, SAR, and INR. You can set your default currency in the settings and change it for individual invoices as needed."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          question: "How is my data protected?",
          answer: "We take data security seriously. All your data is encrypted in transit and at rest. We use enterprise-grade security measures and regular backups to ensure your information is safe and always available when you need it."
        },
        {
          question: "Can I export my data?",
          answer: "Yes! You can export your invoices as PDF files and your client data as CSV files. This ensures you always have access to your data and can migrate to other systems if needed."
        },
        {
          question: "What happens if I lose access to my account?",
          answer: "If you have an account with us, your data is safely stored in the cloud and can be recovered. Simply use the password reset feature or contact our support team for assistance."
        }
      ]
    },
    {
      category: "Technical",
      questions: [
        {
          question: "Does InvoicePro work on mobile devices?",
          answer: "Yes! InvoicePro is fully responsive and works great on all devices including smartphones and tablets. You can create, edit, and send invoices from anywhere."
        },
        {
          question: "Do I need to install any software?",
          answer: "No installation required! InvoicePro is a web-based application that works in any modern web browser. Simply visit our website and start creating invoices immediately."
        },
        {
          question: "What browsers are supported?",
          answer: "InvoicePro works with all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
        }
      ]
    },
    {
      category: "Support",
      questions: [
        {
          question: "How can I get help if I have issues?",
          answer: "We offer multiple support channels: check this FAQ section first, contact us through the contact form on our website, or email us directly at support@invoicepro.com. We typically respond within 24 hours."
        },
        {
          question: "Do you offer phone support?",
          answer: "Currently, we provide support primarily through email and our contact form. This allows us to keep our service free while still providing excellent support to all our users."
        },
        {
          question: "Can you help me migrate from another invoicing system?",
          answer: "We'd be happy to help! Contact our support team with details about your current system, and we'll provide guidance on how to migrate your data to InvoicePro."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about InvoicePro. Can't find what you're looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-12">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openItems.includes(globalIndex);
                    
                    return (
                      <Card key={faqIndex} className="overflow-hidden">
                        <Collapsible>
                          <CollapsibleTrigger 
                            className="w-full"
                            onClick={() => toggleItem(globalIndex)}
                          >
                            <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                              <h3 className="text-lg font-semibold text-gray-900 text-left">
                                {faq.question}
                              </h3>
                              {isOpen ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0 pb-6 px-6">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <Card className="p-8 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <Button 
                  onClick={() => navigate('/contact')}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQs;
