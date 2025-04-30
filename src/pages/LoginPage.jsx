import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoMailOutline, IoLockClosedOutline, IoLogoGoogle } from 'react-icons/io5';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    try {
      setIsSubmitting(true);
      const success = await signIn(email, password);
      
      if (success) {
        // Redirect to dashboard or the page they were trying to access
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Sign in to your PortfolioBuilder account</p>
        </div>
        
        {errors.general && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            icon={IoMailOutline}
          />
          
          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            icon={IoLockClosedOutline}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className="py-3"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            fullWidth
            className="py-3"
            onClick={() => alert('Google login would be implemented here')}
          >
            <IoLogoGoogle className="mr-2" />
            Sign in with Google
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;