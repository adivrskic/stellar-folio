import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Instead of directly importing from @stripe/stripe-js, we'll handle this
// differently to avoid the import error
import Button from '../components/common/Button';
import { 
  IoCheckmarkOutline, 
  IoCloseOutline,
  IoRocketOutline,
  IoStarOutline,
  IoDiamondOutline
} from 'react-icons/io5';

// Initialize Stripe - we'll modify this part
// The code below ensures Stripe is loaded dynamically when needed
let stripePromise = null;
const getStripe = async () => {
  if (!stripePromise) {
    // Dynamic import (works in Vite and most modern bundlers)
    const { loadStripe } = await import('@stripe/stripe-js');
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, isPaidUser, userSubscription } = useAuth();
  const navigate = useNavigate();
  
  // If user is already subscribed, redirect to dashboard
  useEffect(() => {
    if (userSubscription && userSubscription.status === 'active') {
      navigate('/dashboard');
    }
  }, [userSubscription, navigate]);
  
  // Define pricing plans
  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      icon: <IoRocketOutline size={24} className="text-gray-600" />,
      features: [
        'Up to 1 portfolio',
        'Basic templates',
        'Export as PDF',
        'PortfolioBuilder branding',
        '100 MB storage',
      ],
      notIncluded: [
        'Custom domain',
        'Analytics',
        'Premium templates',
        'Password protection',
        'Priority support',
      ],
      buttonText: 'Current Plan',
      priceId: null,
    },
    pro: {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      icon: <IoStarOutline size={24} className="text-primary-600" />,
      features: [
        'Unlimited portfolios',
        'All templates',
        'Export as PDF',
        'Custom domain',
        'Basic analytics',
        'No PortfolioBuilder branding',
        '1 GB storage',
      ],
      notIncluded: [
        'Advanced analytics',
        'Password protection',
        'Priority support',
      ],
      buttonText: 'Upgrade to Pro',
      priceId: {
        monthly: 'price_pro_monthly',
        yearly: 'price_pro_yearly',
      },
      popular: true,
    },
    premium: {
      name: 'Premium',
      price: { monthly: 19.99, yearly: 199.99 },
      icon: <IoDiamondOutline size={24} className="text-secondary-600" />,
      features: [
        'Unlimited portfolios',
        'All templates',
        'Export as PDF',
        'Custom domain',
        'Advanced analytics',
        'No PortfolioBuilder branding',
        'Password protection',
        'Priority support',
        '10 GB storage',
      ],
      notIncluded: [],
      buttonText: 'Upgrade to Premium',
      priceId: {
        monthly: 'price_premium_monthly',
        yearly: 'price_premium_yearly',
      },
    },
  };
  
  // Handle subscription
  const handleSubscribe = async (planType, priceId) => {
    if (!priceId) return;
    
    try {
      setProcessing(true);
      setError(null);
      
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/login', { state: { from: '/pricing' } });
        return;
      }
      
      // Load Stripe dynamically
      const stripe = await getStripe();
      
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
        throw stripeError;
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to initialize payment process. Please try again.');
      setProcessing(false);
    }
  };
  
  // Calculate savings
  const calculateSavings = (plan) => {
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    const savings = monthlyTotal - yearlyCost;
    const savingsPercentage = Math.round((savings / monthlyTotal) * 100);
    
    return { savings, savingsPercentage };
  };
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for you. All plans include a 14-day free trial.
          </p>
          
          {/* Billing toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative bg-white rounded-full p-1 shadow-sm inline-flex">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 text-sm font-medium rounded-full ${
                  selectedPlan === 'monthly'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 text-sm font-medium rounded-full ${
                  selectedPlan === 'yearly'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yearly
              </button>
              
              {/* Save badge */}
              {selectedPlan === 'yearly' && (
                <div className="absolute -top-3 -right-2">
                  <div className="bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Save 16%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => {
            const isCurrentPlan = key === 'free' && !isPaidUser();
            const isPro = key === 'pro' && isPaidUser() && userSubscription?.tier === 'pro';
            const isPremium = key === 'premium' && isPaidUser() && userSubscription?.tier === 'premium';
            
            return (
              <div
                key={key}
                className={`bg-white rounded-lg shadow-md overflow-hidden relative ${
                  plan.popular ? 'ring-2 ring-primary-500 md:scale-105 z-10' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 bg-primary-500 text-white text-xs font-bold text-center py-1">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="mr-3">{plan.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price[selectedPlan]}
                      </span>
                      {plan.price[selectedPlan] > 0 && (
                        <span className="ml-1 text-gray-500">/{selectedPlan === 'monthly' ? 'month' : 'year'}</span>
                      )}
                    </div>
                    
                    {selectedPlan === 'yearly' && plan.price.yearly > 0 && (
                      <div className="mt-1 text-sm text-green-600">
                        Save ${calculateSavings(plan).savings.toFixed(2)} per year
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <Button
                      variant={key === 'free' ? 'outline' : 'primary'}
                      size="lg"
                      className="w-full"
                      disabled={isCurrentPlan || isPro || isPremium || processing}
                      onClick={() => handleSubscribe(key, plan.priceId?.[selectedPlan])}
                    >
                      {isCurrentPlan || isPro || isPremium ? 'Current Plan' : plan.buttonText}
                    </Button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">WHAT'S INCLUDED:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">
                            <IoCheckmarkOutline size={20} />
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                      
                      {plan.notIncluded.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-400">
                          <div className="flex-shrink-0 h-5 w-5">
                            <IoCloseOutline size={20} />
                          </div>
                          <span className="ml-2 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my subscription at any time?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. Upon cancellation, you'll continue to have access to your paid features until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens to my portfolios if I downgrade?</h3>
              <p className="text-gray-600">
                If you downgrade from a paid plan to the free plan, you'll still have access to all your portfolios, but you'll be limited to only one active portfolio. You can choose which one to keep active.
              </p>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer discounts for students and educators?</h3>
              <p className="text-gray-600">
                Yes, we offer a 50% discount on our Pro plan for verified students and educators. Please contact our support team with your academic credentials to apply for this discount.
              </p>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I try before I buy?</h3>
              <p className="text-gray-600">
                Absolutely! All paid plans include a 14-day free trial, giving you full access to all features before committing. No credit card required to start your trial.
              </p>
            </div>
          </div>
        </div>
        
        {/* Enterprise Section */}
        <div className="max-w-4xl mx-auto mt-20 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl text-white p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
              <p className="text-lg opacity-90 mb-6">
                We offer custom enterprise solutions for teams, schools, and organizations.
                Get volume discounts, custom branding, and dedicated support.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
                to="/contact"
              >
                Contact Sales
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;