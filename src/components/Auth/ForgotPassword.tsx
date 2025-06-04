
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Common/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await dataService.resetPassword(email);
      setSubmitted(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <CardHeader className="text-center pb-2">
          <Button variant="ghost" className="absolute left-4 top-4" asChild>
            <Link to="/auth">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex flex-col items-center justify-center space-y-2">
            <Logo className="mb-2" textClassName="text-2xl" />
            <CardTitle className="text-xl">Forgot Password</CardTitle>
            <CardDescription className="text-sm">
              {submitted 
                ? "Check your email for a link to reset your password."
                : "Enter your email and we'll send you a link to reset your password."
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-600">Reset link sent!</p>
              <Button variant="outline" asChild>
                <Link to="/auth">Return to Login</Link>
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
