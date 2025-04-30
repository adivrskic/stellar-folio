import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { IoMailOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { resetPassword } = useAuth();
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await resetPassword(email);
      
      // Show success message
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
        <p className="mt-2 text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>
      
      {success ? (
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <IoCheckmarkCircleOutline className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-green-800">Reset Link Sent</h3>
          <p className="mt-2 text-green-600">
            We've sent a password reset link to {email}. Please check your inbox.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
            icon={IoMailOutline}
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className="py-3"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;