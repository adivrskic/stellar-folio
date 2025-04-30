import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';
import Button from '../components/common/Button';
import { 
  IoArrowBack, 
  IoCodeSlash, 
  IoRocketOutline, 
  IoAlertCircleOutline,
  IoPencil 
} from 'react-icons/io5';

// Template imports 
import TechMinimal from '../templates/tech/TechMinimal';
import TechModern from '../templates/tech/TechModern';
import DesignPortfolio from '../templates/design/DesignPortfolio';

const PortfolioPreviewPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  
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
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [portfolioId, user]);
  
  // Handle deploy button click
  const handleDeploy = () => {
    if (isPaidUser()) {
      navigate(`/dashboard/deploy/${portfolioId}`);
    } else {
      setIsDeployModalOpen(true);
    }
  };
  
  // Render the selected template
  const renderTemplate = () => {
    if (!portfolio || !portfolio.template || !portfolio.resume_data) {
      return (
        <div className="p-6 text-center">
          <IoAlertCircleOutline size={48} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Portfolio data not available
          </h3>
          <p className="text-gray-500">
            The portfolio content or template is missing.
          </p>
        </div>
      );
    }
    
    // Template props
    const templateProps = {
      data: portfolio.resume_data,
      settings: portfolio.template_settings || {},
    };
    
    // Render the appropriate template
    switch (portfolio.template) {
      case 'tech-minimal':
        return <TechMinimal {...templateProps} />;
      case 'tech-modern':
        return <TechModern {...templateProps} />;
      case 'design-portfolio':
        return <DesignPortfolio {...templateProps} />;
      default:
        return (
          <div className="p-6 text-center">
            <IoAlertCircleOutline size={48} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Template not found
            </h3>
            <p className="text-gray-500">
              The selected template could not be loaded.
            </p>
          </div>
        );
    }
  };
  
  // Deploy upgrade modal
  const DeployUpgradeModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
              <IoRocketOutline className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Upgrade to Deploy
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  To deploy your portfolio website with a custom domain, you need to upgrade to a paid plan. 
                  Our paid plans include custom domain setup, SSL certificates, and removal of PortfolioBuilder branding.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <Button
              variant="primary"
              to="/pricing"
              className="sm:col-start-2"
            >
              View Pricing
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeployModalOpen(false)}
              className="mt-3 sm:mt-0"
            >
              Not Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  
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
  
  return (
    <div className="pb-10 min-h-screen flex flex-col">
      {/* Preview toolbar */}
      <div className="sticky top-0 bg-white shadow-sm border-b border-gray-200 py-3 px-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dashboard/editor/${portfolioId}`)}
            >
              <IoArrowBack className="mr-1" /> Back to Editor
            </Button>
            
            <h1 className="text-xl font-semibold text-gray-800">
              {portfolio.name}
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dashboard/editor/${portfolioId}`)}
            >
              <IoPencil className="mr-1" /> Edit
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeploy}
            >
              <IoRocketOutline className="mr-1" /> Deploy Website
            </Button>
          </div>
        </div>
      </div>
      
      {/* Template preview */}
      <div className="flex-grow overflow-hidden">
        <div className="w-full h-full overflow-auto border border-gray-200 bg-gray-50">
          {renderTemplate()}
        </div>
      </div>
      
      {/* Deploy upgrade modal */}
      {isDeployModalOpen && <DeployUpgradeModal />}
    </div>
  );
};

export default PortfolioPreviewPage;