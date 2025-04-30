import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CTA = () => {
  const { user, userSubscription } = useAuth();
  
  // If user is on the Professional plan, don't show the CTA
  if (user && userSubscription?.plan_name === 'Professional') {
    return null;
  }
  
  return (
    <div id="cta" className="py-20 bg-gradient-to-r from-primary-500 to-secondary-700 text-white relative">
      {/* Top wave divider */}
      <div className="absolute top-0 w-full">
        <svg
          className="w-full text-white transform rotate-180"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 text-center">
        {user ? (
          // Content for logged-in users (upgrade messaging)
          <>
            <h2 className="text-3xl font-bold mb-6">Ready to unlock more features?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Upgrade your PortfolioBuilder plan to access premium templates, custom domains, and analytics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/dashboard/account" 
                className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition"
              >
                Upgrade Your Plan
              </Link>
            </div>
          </>
        ) : (
          // Content for non-logged-in users
          <>
            <h2 className="text-3xl font-bold mb-6">Ready to showcase your professional journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who use PortfolioBuilder to stand out in the job market.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="bg-white text-primary-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition"
              >
                Start For Free Today
              </Link>
              <Link 
                to="/pricing" 
                className="bg-transparent border-2 border-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition"
              >
                View Pricing
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Bottom wave divider */}
      <div className="absolute bottom-0 w-full">
        <svg
          className="w-full text-white"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default CTA;