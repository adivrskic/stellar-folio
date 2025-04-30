import React from 'react';
import { Link } from 'react-router-dom';
import { IoCloudUploadOutline, IoRocketOutline } from 'react-icons/io5';
import BackgroundWave from '../common/BackgroundWave';
import { scrollToSection } from '../../utils/scrollUtils';
import Button from '../common/Button';

const Hero = () => {
  return (
    <div id="hero" className="bg-gradient-to-r from-primary-500 to-secondary-700 text-white">
      <BackgroundWave />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold pb-8">PortfolioBuilder</h1>
          <p className="text-xl md:text-2xl mb-12">
            Transform your resume into a stunning, customizable portfolio website in minutes. Stand out from the crowd and showcase your professional journey.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              to="/dashboard/upload"
              className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg"
            >
              <IoCloudUploadOutline size={22} className="mr-2" />
              Upload Your Resume
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={(e) => scrollToSection(e, 'howItWorks')}
              className="border-white text-white hover:bg-white hover:bg-opacity-20"
            >
              <IoRocketOutline size={22} className="mr-2" />
              How It Works
            </Button>
          </div>
        </div>
      </div>
      
      {/* Curved wave shape divider */}
      <div className="h-24 relative overflow-hidden">
        <svg
          className="absolute bottom-0 w-full text-white"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;