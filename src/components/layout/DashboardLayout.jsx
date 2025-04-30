import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  IoGridOutline,
  IoFolderOpenOutline,
  IoCloudUploadOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoColorPaletteOutline,
  IoChevronDownOutline
} from 'react-icons/io5';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, userSubscription, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.user_metadata?.full_name) return 'U';
    
    const names = user.user_metadata.full_name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  // Get plan badge color
  const getPlanBadgeColor = () => {
    if (!userSubscription) return 'bg-gray-200 text-gray-800';
    
    switch (userSubscription.plan_name.toLowerCase()) {
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      case 'starter':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="p-3 md:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow-md text-gray-700"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-md fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <NavLink to="/" className="text-2xl font-bold text-primary-600">
            PortfolioBuilder
          </NavLink>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
              {getUserInitials()}
            </div>
            <div className="ml-3">
              <p className="font-medium truncate max-w-[180px]">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getPlanBadgeColor()}`}>
                {userSubscription?.plan_name || 'Free'} Plan
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <IoGridOutline className="mr-3" size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/portfolios"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <IoFolderOpenOutline className="mr-3" size={20} />
                <span>My Portfolios</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/upload"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <IoCloudUploadOutline className="mr-3" size={20} />
                <span>Upload Resume</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/templates"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <IoColorPaletteOutline className="mr-3" size={20} />
                <span>Templates</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/account"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <IoPersonOutline className="mr-3" size={20} />
                <span>Account</span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <IoLogOutOutline className="mr-3" size={20} />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="p-6 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;