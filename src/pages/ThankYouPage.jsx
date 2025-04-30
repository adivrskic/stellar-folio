import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { 
  IoCheckmarkCircleOutline, 
  IoRocketOutline,
  IoHomeOutline,
  IoPersonOutline,
  IoMailOutline
} from 'react-icons/io5';

const ThankYouPage = () => {
  const { user, refreshUserSubscription } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get parameters from URL or state
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || (location.state && location.state.type) || 'subscription';
  const tier = queryParams.get('tier') || (location.state && location.state.tier) || 'pro';
  
  // Refresh user subscription data when component mounts
  useEffect(() => {
    if (user && type === 'subscription') {
      refreshUserSubscription();
    }
  }, [user, type, refreshUserSubscription]);
  
  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Get appropriate message based on action type
  const getMessage = () => {
    switch (type) {
      case 'subscription':
        return {
          title: `Welcome to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`,
          description: `Your ${tier} subscription is now active. You now have access to all ${tier} features and benefits.`,
          icon: <IoRocketOutline size={48} className="text-primary-500" />,
          nextSteps: [
            {
              title: 'Explore Your Dashboard',
              description: 'Check out your new features and start creating amazing portfolios.',
              action: <Button variant="primary" to="/dashboard">Go to Dashboard</Button>
            },
            {
              title: 'Create a New Portfolio',
              description: 'Start building your professional online presence right away.',
              action: <Button variant="outline" to="/dashboard/templates">Browse Templates</Button>
            }
          ]
        };
      case 'contact':
        return {
          title: 'Message Received!',
          description: 'Thank you for reaching out. We\'ve received your message and will get back to you within 24 hours.',
          icon: <IoMailOutline size={48} className="text-primary-500" />,
          nextSteps: [
            {
              title: 'Explore Our Templates',
              description: 'While you wait for our response, check out our portfolio templates.',
              action: <Button variant="primary" to="/templates">Browse Templates</Button>
            },
            {
              title: 'Return Home',
              description: 'Learn more about our features and pricing.',
              action: <Button variant="outline" to="/">Back to Home</Button>
            }
          ]
        };
      case 'registration':
        return {
          title: 'Welcome to PortfolioBuilder!',
          description: 'Your account has been created successfully. You\'re ready to start building your professional portfolio.',
          icon: <IoPersonOutline size={48} className="text-primary-500" />,
          nextSteps: [
            {
              title: 'Complete Your Profile',
              description: 'Add your information to personalize your experience.',
              action: <Button variant="primary" to="/dashboard/profile">Complete Profile</Button>
            },
            {
              title: 'Create Your First Portfolio',
              description: 'Start by uploading your resume or choosing a template.',
              action: <Button variant="outline" to="/dashboard/upload">Upload Resume</Button>
            }
          ]
        };
      default:
        return {
          title: 'Thank You!',
          description: 'Your action has been completed successfully.',
          icon: <IoCheckmarkCircleOutline size={48} className="text-primary-500" />,
          nextSteps: [
            {
              title: 'Return to Dashboard',
              description: 'Continue working on your portfolios.',
              action: <Button variant="primary" to="/dashboard">Go to Dashboard</Button>
            },
            {
              title: 'Return Home',
              description: 'Learn more about our features and pricing.',
              action: <Button variant="outline" to="/"><IoHomeOutline className="mr-1" /> Back to Home</Button>
            }
          ]
        };
    }
  };
  
  const message = getMessage();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4">
              {message.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{message.title}</h1>
            <p className="text-gray-600">{message.description}</p>
          </div>
          
          {type === 'subscription' && (
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-primary-800 mb-2">Your Receipt</h3>
              <p className="text-sm text-primary-700">
                A receipt for your purchase has been sent to your email address.
                If you have any questions about your subscription, please contact our support team.
              </p>
            </div>
          )}
          
          <div className="space-y-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Next Steps</h2>
            
            {message.nextSteps.map((step, index) => (
              <div key={index} className="border-l-4 border-primary-400 pl-4 py-2">
                <h3 className="font-medium text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                {step.action}
              </div>
            ))}
          </div>
          
          {type === 'subscription' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your new subscription, our support team is here to help.
              </p>
              <Link to="/help" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Visit Help Center
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;