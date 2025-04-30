import React from 'react';

const BackgroundWave = () => {
  return (
    <>
      {/* Decorative background elements - similar to the example provided */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-secondary-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </>
  );
};

export default BackgroundWave;