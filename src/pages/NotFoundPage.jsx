import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { 
  IoSearchOutline,
  IoHomeOutline,
  IoHelpCircleOutline,
  IoArrowBackOutline
} from 'react-icons/io5';

const NotFoundPage = () => {
  // Get the previous page from history if available
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <IoSearchOutline size={64} className="text-primary-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
            <h3 className="font-medium text-gray-800 mb-3">What you can do now:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Check the URL for typos or mistakes
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Return to the homepage
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Go back to the previous page
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="primary" 
              to="/" 
              className="w-full flex justify-center items-center"
            >
              <IoHomeOutline className="mr-2" /> Go to Homepage
            </Button>
            
            <Button 
              variant="outline" 
              onClick={goBack} 
              className="w-full flex justify-center items-center"
            >
              <IoArrowBackOutline className="mr-2" /> Go Back
            </Button>
            
            <Link to="/help" className="block text-center text-primary-600 hover:text-primary-700 mt-6 flex items-center justify-center">
              <IoHelpCircleOutline className="mr-1" /> Need help? Contact support
            </Link>
          </div>
        </div>
      </div>
      
      {/* Optional search box - uncomment if you want to include search functionality */}
      {/* 
      <div className="max-w-md mx-auto mt-8 text-center">
        <p className="text-gray-600 mb-2">Looking for something specific?</p>
        <div className="flex mt-2">
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <IoSearchOutline size={20} />
          </button>
        </div>
      </div>
      */}
    </div>
  );
};

export default NotFoundPage;