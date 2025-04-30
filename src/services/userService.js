import { supabase } from '../context/AuthContext';

/**
 * Fetch user subscription data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The user's subscription data
 */
export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  
  return data;
};

/**
 * Create default subscription for new user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The created subscription data
 */
export const createDefaultSubscription = async (userId) => {
  // Set renewal date to 30 days from now
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 30);
  
  const defaultSubscription = {
    user_id: userId,
    plan_name: 'Free',
    current_usage: 0,
    total_limit: 3, // Free tier allows 3 portfolios
    renewal_date: renewalDate.toISOString()
  };
  
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([defaultSubscription])
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Update user's subscription plan
 * @param {string} userId - User ID
 * @param {string} planName - New plan name
 * @param {Object} planDetails - Optional plan details to update
 * @returns {Promise<Object>} - The updated subscription data
 */
export const updateUserPlan = async (userId, planName, planDetails = {}) => {
  // Define plan limits based on name
  let totalLimit = 3; // Default for Free plan
  
  if (planName === 'Starter') {
    totalLimit = 5;
  } else if (planName === 'Professional') {
    totalLimit = 999; // Effectively unlimited
  }
  
  // Set renewal date to 30 days from now
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 30);
  
  const updateData = {
    plan_name: planName,
    total_limit: totalLimit,
    renewal_date: renewalDate.toISOString(),
    ...planDetails
  };
  
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Increment user's portfolio usage count
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The updated subscription data
 */
export const incrementPortfolioUsage = async (userId) => {
  // First get current usage
  const { data: subscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('current_usage')
    .eq('user_id', userId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Increment usage
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      current_usage: (subscription.current_usage || 0) + 1
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

/**
 * Check if user can create more portfolios
 * @param {Object} subscription - User's subscription data
 * @returns {boolean} - Whether user can create more portfolios
 */
export const canCreatePortfolio = (subscription) => {
  if (!subscription) return false;
  
  return subscription.current_usage < subscription.total_limit;
};

/**
 * Check if user is on a paid plan
 * @param {Object} subscription - User's subscription data
 * @returns {boolean} - Whether user is on a paid plan
 */
export const isPaidUser = (subscription) => {
  if (!subscription) return false;
  
  return ['Professional', 'Starter'].includes(subscription.plan_name);
};