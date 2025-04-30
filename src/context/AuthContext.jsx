import { createContext, useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth - check for existing session
  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user subscription data
        await fetchUserSubscription(session.user.id);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      toast.error('Error signing in with your current session.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch user subscription data
  const fetchUserSubscription = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }
      
      if (data) {
        setUserSubscription(data);
      } else {
        // Create a default free subscription
        const defaultSubscription = {
          user_id: userId,
          plan_name: 'Free',
          current_usage: 0,
          total_limit: 3, // Free tier allows 3 portfolios
          renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        };
        
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([defaultSubscription]);
          
        if (insertError) {
          console.error('Error creating default subscription:', insertError);
          return;
        }
        
        setUserSubscription(defaultSubscription);
      }
    } catch (error) {
      console.error('Error in subscription logic:', error);
    }
  };
  
  // Set up auth state change listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserSubscription(session.user.id);
        } else {
          setUser(null);
          setUserSubscription(null);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true);
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error signing up. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success('Signed in successfully!');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error signing in. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setUserSubscription(null);
      toast.success('Signed out successfully!');
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password reset link sent to your email!');
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Error sending password reset link. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (data) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data,
      });
      
      if (error) {
        throw error;
      }
      
      // Update the local user state
      setUser((prev) => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          ...data,
        },
      }));
      
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user is on a paid plan
  const isPaidUser = () => {
    return userSubscription && ['Professional', 'Starter'].includes(userSubscription.plan_name);
  };
  
  // Check if user can create more portfolios
  const canCreatePortfolio = () => {
    if (!userSubscription) return false;
    
    return userSubscription.current_usage < userSubscription.total_limit;
  };
  
  const value = {
    user,
    userSubscription,
    loading,
    initAuth,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isPaidUser,
    canCreatePortfolio,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};