import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../context/AuthContext';
import { 
  IoCloudUploadOutline, 
  IoColorPaletteOutline, 
  IoFolderOpenOutline,
  IoBarChartOutline,
  IoPersonOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import Button from '../components/common/Button';

const DashboardPage = () => {
  const { user, userSubscription } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch user's portfolios
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPortfolios(data || []);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        setError('Failed to load your portfolios. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolios();
  }, [user]);
  
  // Get stats
  const getPortfolioCount = () => portfolios.length;
  const getDeployedCount = () => portfolios.filter(p => p.deployed).length;
  const getLatestPortfolio = () => {
    if (portfolios.length === 0) return null;
    return portfolios[0];
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if user can create new portfolio
  const canCreatePortfolio = () => {
    if (!userSubscription) return false;
    return userSubscription.current_usage < userSubscription.total_limit;
  };
  
  // Quick actions
  const quickActions = [
    {
      name: 'Upload Resume',
      description: 'Create a new portfolio from your resume',
      icon: IoCloudUploadOutline,
      color: 'bg-blue-100 text-blue-600',
      link: '/dashboard/upload',
      enabled: canCreatePortfolio()
    },
    {
      name: 'Browse Templates',
      description: 'Explore available portfolio templates',
      icon: IoColorPaletteOutline,
      color: 'bg-purple-100 text-purple-600',
      link: '/dashboard/templates',
      enabled: true
    },
    {
      name: 'My Portfolios',
      description: 'View and manage your portfolios',
      icon: IoFolderOpenOutline,
      color: 'bg-green-100 text-green-600',
      link: '/dashboard/portfolios',
      enabled: true
    }
  ];
  
  return (
    <div>
      {/* Welcome message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.user_metadata?.full_name || 'there'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your PortfolioBuilder account.
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Portfolio Usage</h2>
            <IoBarChartOutline size={20} className="text-gray-400" />
          </div>
          
          {userSubscription ? (
            <>
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  {userSubscription.current_usage} of {userSubscription.total_limit} portfolios
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((userSubscription.current_usage / userSubscription.total_limit) * 100)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(Math.round((userSubscription.current_usage / userSubscription.total_limit) * 100), 100)}%` }}
                ></div>
              </div>
              
              {userSubscription.plan_name !== 'Professional' && (
                <Link to="/pricing" className="mt-3 inline-block text-sm text-primary-600 hover:text-primary-700">
                  Need more portfolios? Upgrade your plan
                </Link>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center p-6">
              <IoAlertCircleOutline size={20} className="text-red-500 mr-2" />
              <span className="text-red-500">Subscription information unavailable</span>
            </div>
          )}
        </div>
        
        {/* Current Plan */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
            <IoPersonOutline size={20} className="text-primary-500" />
          </div>
          
          {userSubscription ? (
            <>
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {userSubscription.plan_name}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Your plan renews on {formatDate(userSubscription.renewal_date)}.
              </p>
              
              {userSubscription.plan_name !== 'Professional' ? (
                <Link 
                  to="/pricing" 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Upgrade plan
                </Link>
              ) : (
                <span className="text-sm text-gray-600 font-medium">
                  You're on our highest tier plan
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center p-6">
              <IoAlertCircleOutline size={20} className="text-red-500 mr-2" />
              <span className="text-red-500">Plan information unavailable</span>
            </div>
          )}
        </div>
        
        {/* Portfolio Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Portfolio Stats</h2>
            <IoFolderOpenOutline size={20} className="text-gray-400" />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-6">
              <IoAlertCircleOutline size={20} className="text-red-500 mr-2" />
              <span className="text-red-500">{error}</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Portfolios:</span>
                <span className="text-sm font-medium">{getPortfolioCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Deployed:</span>
                <span className="text-sm font-medium">{getDeployedCount()}</span>
              </div>
              {getLatestPortfolio() && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Latest:</span>
                  <span className="text-sm font-medium">
                    {formatDate(getLatestPortfolio().created_at)}
                  </span>
                </div>
              )}
              <div className="pt-2">
                <Link 
                  to="/dashboard/portfolios" 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all portfolios
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col ${
                !action.enabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <div className={`${action.color} p-3 rounded-full mb-3 self-start`}>
                <action.icon size={24} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.name}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              
              {!action.enabled && action.name === 'Upload Resume' && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                  <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
                    Portfolio limit reached. Upgrade your plan.
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent portfolios */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Portfolios</h2>
          <Link 
            to="/dashboard/portfolios" 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <IoAlertCircleOutline size={40} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">{error}</h3>
            <p className="text-gray-500 mb-4">Please try refreshing the page.</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh
            </Button>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <IoFolderOpenOutline size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No portfolios yet</h3>
            <p className="text-gray-500 mb-6">Upload your resume to create your first portfolio</p>
            {canCreatePortfolio() ? (
              <Button 
                to="/dashboard/upload"
                variant="primary"
              >
                Upload Resume
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-600">You've reached your portfolio limit.</p>
                <Button 
                  to="/pricing"
                  variant="primary"
                >
                  Upgrade Plan
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolios.slice(0, 3).map((portfolio) => (
                  <tr key={portfolio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium text-sm">
                            {portfolio.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{portfolio.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {portfolio.template}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(portfolio.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        portfolio.deployed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {portfolio.deployed ? 'Deployed' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/dashboard/editor/${portfolio.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/dashboard/preview/${portfolio.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;