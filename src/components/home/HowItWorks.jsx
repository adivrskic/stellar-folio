import React from 'react';
import { 
  IoCloudUploadOutline, 
  IoColorPaletteOutline, 
  IoGlobeOutline, 
  IoRocketOutline 
} from 'react-icons/io5';

const HowItWorks = () => {
  const steps = [
    {
      icon: IoCloudUploadOutline,
      title: "1. Upload Your Resume",
      description: "Simply upload your existing resume in PDF or Word format. Our intelligent parser will automatically extract your professional information."
    },
    {
      icon: IoColorPaletteOutline,
      title: "2. Choose a Template",
      description: "Select from a variety of professionally designed templates. Each template is optimized for different industries and career levels."
    },
    {
      icon: IoGlobeOutline,
      title: "3. Customize Your Portfolio",
      description: "Personalize your portfolio with your brand colors, add additional sections, and fine-tune the content to showcase your unique skills."
    },
    {
      icon: IoRocketOutline,
      title: "4. Deploy Your Website",
      description: "With one click, deploy your portfolio website to the web with your own custom domain. Share your professional story with the world."
    }
  ];

  return (
    <div id="howItWorks" className="py-20 bg-white relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-primary-100 p-4 rounded-full inline-block mb-4">
                <step.icon className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* Optional: Add a CTA button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => window.location.href = '/register'}
            className="bg-primary-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-primary-700 transition"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;