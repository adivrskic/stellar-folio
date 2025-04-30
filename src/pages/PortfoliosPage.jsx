import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { 
  IoAddOutline, 
  IoCreateOutline, 
  IoEyeOutline, 
  IoTrashOutline,
  IoRocketOutline
} from 'react-icons/io5';
import { formatDistanceToNow } from 'date-fns';

const PortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user's portfolios
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPortfolios(data || []);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolios. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolios();
  }, [user]);

  // Open delete confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle portfolio deletion
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', deleteId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update state after successful deletion
      setPortfolios(portfolios.filter(p => p.id !== deleteId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      setError('Failed to delete portfolio. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Portfolios</h1>
        <Button
          variant="primary"
          to="/dashboard/templates"
          className="flex items-center"
        >
          <IoAddOutline className="mr-1" /> Create New Portfolio
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {portfolios.length === 0 ? (
        <EmptyState
          icon={<IoCreateOutline size={48} />}
          title="No portfolios yet"
          description="Get started by creating your first portfolio. Upload your resume or start from scratch with one of our templates."
          action={
            <Button
              variant="primary"
              to="/dashboard/templates"
              size="lg"
            >
              Create Your First Portfolio
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div 
              key={portfolio.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div 
                className="h-40 bg-gray-200 relative overflow-hidden"
                style={{
                  backgroundImage: portfolio.thumbnail_url ? `url(${portfolio.thumbnail_url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!portfolio.thumbnail_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary-400 to-secondary-500 text-white text-xl font-bold">
                    {portfolio.name || 'My Portfolio'}
                  </div>
                )}
                
                {portfolio.deployed && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                    <IoRocketOutline className="mr-1" /> Live
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {portfolio.name || 'Untitled Portfolio'}
                </h3>
                
                <p className="text-sm text-gray-500 mb-3">
                  {portfolio.created_at && (
                    <>Created {formatDistanceToNow(new Date(portfolio.created_at), { addSuffix: true })}</>
                  )}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/editor/${portfolio.id}`)}
                      title="Edit Portfolio"
                    >
                      <IoCreateOutline />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/preview/${portfolio.id}`)}
                      title="Preview Portfolio"
                    >
                      <IoEyeOutline />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(portfolio.id)}
                      title="Delete Portfolio"
                      className="text-red-500 hover:text-red-700 hover:border-red-300"
                    >
                      <IoTrashOutline />
                    </Button>
                  </div>
                  
                  {portfolio.deployed ? (
                    <Link
                      to={`/dashboard/deployment/${portfolio.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Deployment
                    </Link>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/dashboard/deployment/${portfolio.id}`)}
                    >
                      Deploy
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Portfolio"
        description="Are you sure you want to delete this portfolio? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default PortfoliosPage;