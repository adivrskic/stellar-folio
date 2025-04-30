import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingScreen from '../components/common/LoadingScreen';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { 
  IoPersonOutline,
  IoMailOutline,
  IoKeyOutline,
  IoCreditCardOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';

const AccountPage = () => {
  const { user, userSubscription, refreshUserSubscription, logout } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Delete account dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setName(data.full_name || '');
          setEmail(user.email || '');
        }
        
        // Refresh subscription data
        refreshUserSubscription();
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate, refreshUserSubscription]);
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setSuccess('');
      setError('');
      
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setSuccess('');
      setError('');
      
      // Validate password
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        setUpdating(false);
        return;
      }
      
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        setUpdating(false);
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setSuccess('Password updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password. Please ensure your current password is correct.');
    } finally {
      setUpdating(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError('');
      
      // Delete user account
      // Note: In a real implementation, this would include server-side logic to handle data cleanup
      const { error } = await supabase.rpc('delete_user', {
        user_id: user.id
      });
      
      if (error) throw error;
      
      // Log out user
      await logout();
      
      // Redirect to home page
      navigate('/', { 
        state: { 
          message: 'Your account has been deleted successfully. We're sorry to see you go.' 
        } 
      });
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again or contact support.');
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Format subscription details
  const formatSubscriptionDetails = () => {
    if (!userSubscription) {
      return {
        tier: 'Free',
        status: 'active',
        renewalDate: null,
        price: '$0.00',
        billingCycle: null
      };
    }
    
    return {
      tier: userSubscription.tier.charAt(0).toUpperCase() + userSubscription.tier.slice(1),
      status: userSubscription.status,
      renewalDate: userSubscription.current_period_end
        ? new Date(userSubscription.current_period_end).toLocaleDateString()
        : null,
      price: userSubscription.price 
        ? `$${(userSubscription.price / 100).toFixed(2)}`
        : '$0.00',
      billingCycle: userSubscription.interval
    };
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  const subscription = formatSubscriptionDetails();
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <IoPersonOutline className="inline-block mr-2" />
              Profile
            </button>
            
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'security'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <IoKeyOutline className="inline-block mr-2" />
              Security
            </button>
            
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'subscription'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('subscription')}
            >
              <IoCreditCardOutline className="inline-block mr-2" />
              Subscription
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <IoCheckmarkCircleOutline className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    icon={<IoPersonOutline />}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    icon={<IoMailOutline />}
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email address cannot be changed. Contact support for assistance.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <form onSubmit={handlePasswordUpdate} className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      icon={<IoKeyOutline />}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      icon={<IoKeyOutline />}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      icon={<IoKeyOutline />}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete your account and all associated portfolios and data.
                  This action cannot be undone.
                </p>
                
                <Button
                  variant="danger"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <IoTrashOutline className="mr-1" /> Delete Account
                </Button>
              </div>
            </div>
          )}
          
          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div>
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h2>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">Current Plan</dt>
                      <dd className="text-sm font-semibold text-gray-900">{subscription.tier}</dd>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm font-semibold">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscription.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </dd>
                    </div>
                    
                    {subscription.tier !== 'Free' && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-sm font-medium text-gray-500">Price</dt>
                          <dd className="text-sm font-semibold text-gray-900">
                            {subscription.price}/{subscription.billingCycle}
                          </dd>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <dt className="text-sm font-medium text-gray-500">Next Renewal</dt>
                          <dd className="text-sm font-semibold text-gray-900">{subscription.renewalDate}</dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>
              
              {subscription.tier === 'Free' ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upgrade Your Plan</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upgrade to a paid plan to unlock premium features and create unlimited portfolios.
                  </p>
                  
                  <Button
                    variant="primary"
                    to="/pricing"
                  >
                    View Pricing
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Subscription</h3>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/pricing')}
                    >
                      Change Plan
                    </Button>
                    
                    <Button
                      variant="danger"
                      onClick={() => {
                        // In a real implementation, this would open a cancellation flow
                        navigate('/subscription/cancel');
                      }}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      If you cancel, your subscription will remain active until the end of your current billing period.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? All of your portfolios and data will be permanently removed. This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete Account"}
        confirmVariant="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default AccountPage;