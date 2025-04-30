import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { IoMailOutline, IoLockClosedOutline, IoLogoGoogle } from 'react-icons/io5';

const LoginForm = ({ redirectTo = '/dashboard' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
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
      setErrors({});
      
      const success = await signIn(email, password);
      
      if (success) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Invalid email or password. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle Google sign in
  const handleGoogleSignIn = () => {
    // In a real implementation, this would integrate with Supabase Auth Google provider
    alert('Google sign in would be implemented here');
  };

  return (
    <div className="w-full max-w-md">
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
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
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
          onClick={handleGoogleSignIn}
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
  );
};

export default LoginForm;