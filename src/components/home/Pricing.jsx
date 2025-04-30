import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { user, userSubscription, isPaidUser } = useAuth();
  const navigate = useNavigate();
  
  const handlePlanSelect = (planName) => {
    // If user is not logged in, redirect to registration
    if (!user) {
      navigate('/register', { state: { plan: planName, cycle: billingCycle } });
      return;
    }
    
    // Otherwise, go to the dashboard pricing page
    navigate('/dashboard/account', { state: { selectedPlan: planName, cycle: billingCycle } });
  };

  const plans = [
    {
      name: 'Free',
      description: 'For personal use',
      price: {
        monthly: 0,
        annually: 0,
      },
      features: [
        { text: '3 portfolio sites', included: true },
        { text: 'Basic templates', included: true },
        { text: 'Resume parsing', included: true },
        { text: 'Subdomain hosting (portfoliobuilder.com/yourname)', included: true },
        { text: 'Mobile responsive', included: true },
        { text: 'Custom domain', included: false },
        { text: 'Remove PortfolioBuilder branding', included: false },
        { text: 'Analytics', included: false },
        { text: 'SEO optimization', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      name: 'Starter',
      description: 'For professionals',
      price: {
        monthly: 9,
        annually: 89,
      },
      features: [
        { text: '5 portfolio sites', included: true },
        { text: 'All templates', included: true },
        { text: 'Advanced resume parsing', included: true },
        { text: 'Custom domain', included: true },
        { text: 'Remove PortfolioBuilder branding', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'SEO optimization', included: true },
        { text: 'AI content enhancement', included: false },
        { text: 'Portfolio visitor notifications', included: false },
        { text: 'Priority support', included: false },
      ],
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For serious job seekers',
      price: {
        monthly: 19,
        annually: 190,
      },
      features: [
        { text: 'Unlimited portfolio sites', included: true },
        { text: 'All templates + premium templates', included: true },
        { text: 'Advanced resume parsing', included: true },
        { text: 'Custom domain', included: true },
        { text: 'Remove PortfolioBuilder branding', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Full SEO optimization', included: true },
        { text: 'AI content enhancement', included: true },
        { text: 'Portfolio visitor notifications', included: true },
        { text: 'Priority support', included: true },
      ],
      popular: true,
    },
  ];

  const getButtonText = (planName) => {
    if (!userSubscription) return 'Get Started';
    
    if (planName.toLowerCase() === (userSubscription?.plan_name || '').toLowerCase()) {
      return 'Current Plan';
    }
    
    if (planName === 'Free') {
      return 'Downgrade';
    }
    
    if (planName === 'Starter' && userSubscription?.plan_name === 'Professional') {
      return 'Downgrade';
    }
    
    return 'Upgrade';
  };

  return (
    <div id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Choose the plan that works for your needs. No hidden fees, cancel anytime.
        </p>
        
        {/* Billing toggle */}
        <div className="flex justify-center items-center mb-12">
          <button
            className={`px-4 py-2 rounded-l-lg ${
              billingCycle === 'monthly'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${
              billingCycle === 'annually'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setBillingCycle('annually')}
          >
            Annually <span className="text-xs font-bold">Save 20%</span>
          </button>
        </div>
        
        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl overflow-hidden shadow-lg ${
                plan.popular ? 'border-2 border-primary-500 transform md:scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary-600 text-white text-center py-1 text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.annually}
                  </span>
                  <span className="text-gray-600 ml-1">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <button
                  onClick={() => handlePlanSelect(plan.name)}
                  className={`w-full py-3 px-4 rounded-lg font-bold mb-6 ${
                    plan.name.toLowerCase() === (userSubscription?.plan_name || '').toLowerCase()
                      ? 'bg-gray-300 text-gray-700 cursor-default'
                      : 'bg-primary-600 text-white hover:bg-primary-700 transition'
                  }`}
                  disabled={plan.name.toLowerCase() === (userSubscription?.plan_name || '').toLowerCase()}
                >
                  {getButtonText(plan.name)}
                </button>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <IoCheckmarkOutline size={20} className="text-green-500 mt-0.5 mr-2 shrink-0" />
                      ) : (
                        <IoCloseOutline size={20} className="text-gray-400 mt-0.5 mr-2 shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-800' : 'text-gray-500'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ button */}
        <div className="mt-16 text-center">
          <Link to="/pricing" className="text-primary-600 hover:text-primary-700 font-medium">
            View Full Pricing Details & FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;