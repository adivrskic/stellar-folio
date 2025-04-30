import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoLogoGoogle } from 'react-icons/io5';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get any selected plan from location state
  const selectedPlan = location.state?.plan || null;
  const billingCycle = location.state?.cycle || 'monthly';
  
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
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and privacy policy';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    try {
      setIsSubmitting(true);
      const success = await signUp(email, password, fullName);
      
      if (success) {
        // If user selected a plan, redirect to pricing page
        if (selectedPlan && selectedPlan !== 'Free') {
          navigate('/dashboard/account', { 
            state: { 
              selectedPlan, 
              cycle: billingCycle 
            } 
          });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">Start building your professional portfolio today</p>
          
          {selectedPlan && (
            <div className="mt-4 bg-primary-50 p-3 rounded-md">
              <p className="text-primary-700">
                You're signing up for the <strong>{selectedPlan}</strong> plan ({billingCycle})
              </p>
            </div>
          )}
        </div>
        
        {errors.general && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            required
            icon={IoPersonOutline}
          />
          
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
          
          <Input
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
            icon={IoLockClosedOutline}
          />
          
          <div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
                )}
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className="py-3"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
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
            onClick={() => alert('Google sign up would be implemented here')}
          >
            <IoLogoGoogle className="mr-2" />
            Sign up with Google
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;