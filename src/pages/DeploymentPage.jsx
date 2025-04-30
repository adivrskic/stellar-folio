import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { 
  IoArrowBack, 
  IoRocketOutline, 
  IoCheckmarkCircleOutline, 
  IoAlertCircleOutline,
  IoGlobeOutline,
  IoLockClosedOutline
} from 'react-icons/io5';

const DeploymentPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  
  const { id: portfolioId } = useParams();
  const { user, isPaidUser } = useAuth();
  const navigate = useNavigate();
  
  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        
        if (!portfolioId) return;
        
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('id', portfolioId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        if (!data) throw new Error('Portfolio not found');
        
        setPortfolio(data);
        
        // If portfolio is already deployed, set deployment URL
        if (data.deployed && data.deployment_url) {
          setDeploymentUrl(data.deployment_url);
          setSuccess(true);
        }
        
        // If portfolio has a custom domain, set it
        if (data.custom_domain) {
          setCustomDomain(data.custom_domain);
          setUseCustomDomain(true);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [portfolioId, user]);
  
  // Check if user can deploy (must be paid user)
  const canDeploy = () => {
    return isPaidUser();
  };
  
  // Handle deployment
  const handleDeploy = async () => {
    if (!canDeploy()) {
      navigate('/pricing');
      return;
    }
    
    try {
      setDeploying(true);
      setError(null);
      
      // Validate custom domain if using one
      if (useCustomDomain && !isValidDomain(customDomain)) {
        setError('Please enter a valid domain name (e.g., yourdomain.com)');
        setDeploying(false);
        return;
      }
      
      // In a real implementation, this would handle the actual deployment process
      // For this prototype, we'll simulate a deployment with a short delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random deployment URL for the prototype
      const deploymentSubdomain = portfolio.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Use custom domain if provided, otherwise use subdomain
      const finalUrl = useCustomDomain && customDomain
        ? `https://${customDomain}`
        : `https://${deploymentSubdomain}.portfoliobuilder.com`;
      
      // Update portfolio in database
      const { error } = await supabase
        .from('portfolios')
        .update({
          deployed: true,
          deployment_url: finalUrl,
          custom_domain: useCustomDomain ? customDomain : null,
          deployed_at: new Date().toISOString()
        })
        .eq('id', portfolioId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update state
      setDeploymentUrl(finalUrl);
      setSuccess(true);
    } catch (err) {
      console.error('Error deploying portfolio:', err);
      setError('Failed to deploy portfolio. Please try again.');
    } finally {
      setDeploying(false);
    }
  };
  
  // Validate domain format
  const isValidDomain = (domain) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.){1,}([a-zA-Z0-9-]+)$/;
    return domainRegex.test(domain);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <IoAlertCircleOutline size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
          <p className="text-gray-600 mb-6">
            The portfolio you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <Button
            variant="primary"
            to="/dashboard"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // If not a paid user, show upgrade message
  if (!canDeploy()) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/preview/${portfolioId}`)}
          className="mb-8"
        >
          <IoArrowBack className="mr-1" /> Back to Preview
        </Button>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <IoRocketOutline size={48} className="mx-auto mb-4 text-primary-600" />
          <h2 className="text-2xl font-bold mb-2">Deploy Your Portfolio</h2>
          <p className="text-gray-600 mb-6">
            To deploy your portfolio website with a custom domain, you need to upgrade to a paid plan.
            Our paid plans include custom domain setup, SSL certificates, and removal of PortfolioBuilder branding.
          </p>
          <Button
            variant="primary"
            to="/pricing"
            size="lg"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/dashboard/preview/${portfolioId}`)}
        className="mb-8"
        disabled={deploying}
      >
        <IoArrowBack className="mr-1" /> Back to Preview
      </Button>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Deploy Your Portfolio</h1>
        <p className="text-gray-600 mb-6">
          Deploy your portfolio to make it accessible on the web. You can use a custom domain or our free subdomain.
        </p>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <IoCheckmarkCircleOutline className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">Deployment Successful!</h3>
                <div className="mt-2 text-green-700">
                  <p>
                    Your portfolio has been successfully deployed and is now live at:
                  </p>
                  <a 
                    href={deploymentUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center mt-2 text-primary-600 hover:underline"
                  >
                    <IoGlobeOutline className="mr-1" />
                    {deploymentUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleDeploy(); }}>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <IoLockClosedOutline className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    All deployments include a free SSL certificate and HTTPS.
                  </p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <IoAlertCircleOutline className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Domain Settings</h3>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="use-subdomain"
                      name="domain-type"
                      type="radio"
                      checked={!useCustomDomain}
                      onChange={() => setUseCustomDomain(false)}
                      className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="use-subdomain" className="font-medium text-gray-700">
                      Use PortfolioBuilder Subdomain
                    </label>
                    <p className="text-gray-500 text-sm">
                      Your portfolio will be deployed to <strong>yourname.portfoliobuilder.com</strong>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="use-custom-domain"
                      name="domain-type"
                      type="radio"
                      checked={useCustomDomain}
                      onChange={() => setUseCustomDomain(true)}
                      className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <label htmlFor="use-custom-domain" className="font-medium text-gray-700">
                      Use Custom Domain
                    </label>
                    {useCustomDomain && (
                      <div className="mt-2">
                        <Input
                          type="text"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          placeholder="yourdomain.com"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          After deployment, you'll need to update your domain's DNS settings.
                          We'll provide instructions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={deploying}
              >
                {deploying ? 'Deploying...' : 'Deploy Portfolio'}
                {!deploying && <IoRocketOutline className="ml-1" />}
              </Button>
            </div>
          </form>
        )}
      </div>
      
      {success && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-primary-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Share your portfolio</h3>
              <p className="text-gray-600 text-sm mt-1">
                Add your portfolio URL to your resume, LinkedIn profile, and job applications.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Keep it updated</h3>
              <p className="text-gray-600 text-sm mt-1">
                Make sure to update your portfolio regularly as your skills and experience grow.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Track your analytics</h3>
              <p className="text-gray-600 text-sm mt-1">
                Monitor who's viewing your portfolio with the included analytics dashboard.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              to="/dashboard/portfolios"
            >
              View All Portfolios
            </Button>
            
            <Button
              variant="primary"
              onClick={() => {
                // In a real implementation, this would re-trigger the deployment process
                setSuccess(false);
                handleDeploy();
              }}
            >
              Re-deploy Portfolio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentPage;