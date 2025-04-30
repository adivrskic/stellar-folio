import { supabase } from '../context/AuthContext';

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 * @returns {Promise<Object>} - The result of the sign up attempt
 */
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - The result of the sign in attempt
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
};

/**
 * Reset user's password (sends reset email)
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
};

/**
 * Update user's password
 * @param {string} password - New password
 * @returns {Promise<Object>} - The result of the password update
 */
export const updatePassword = async (password) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Update user's profile data
 * @param {Object} data - User profile data to update
 * @returns {Promise<Object>} - The result of the profile update
 */
export const updateProfile = async (data) => {
  const { data: userData, error } = await supabase.auth.updateUser({
    data,
  });
  
  if (error) throw error;
  
  return userData;
};

/**
 * Get the current user session
 * @returns {Promise<Object>} - The current session data
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  return data;
};

/**
 * Get the current user
 * @returns {Promise<Object>} - The current user data
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  
  return data.user;
};