import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-primary-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;