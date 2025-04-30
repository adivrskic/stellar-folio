import React from 'react';
import { 
  IoSpeedometer, 
  IoLayers, 
  IoRocket, 
  IoShield, 
  IoAnalytics, 
  IoPhonePortrait 
} from 'react-icons/io5';

const Features = () => {
  const features = [
    {
      icon: IoSpeedometer,
      title: "Quick Setup",
      description: "Create your portfolio in minutes, not hours. Our intelligent resume parser does the heavy lifting for you."
    },
    {
      icon: IoLayers,
      title: "Professional Templates",
      description: "Choose from a variety of industry-specific templates designed by professional UI/UX designers."
    },
    {
      icon: IoRocket,
      title: "Easy Deployment",
      description: "Deploy your portfolio with one click. Get a custom domain and SSL certificate included with paid plans."
    },
    {
      icon: IoShield,
      title: "Privacy & Security",
      description: "Your data is secured with enterprise-grade encryption. You control what information is visible to the public."
    },
    {
      icon: IoAnalytics,
      title: "Analytics & Insights",
      description: "Track who's viewing your portfolio and from where. Get insights to improve your professional visibility."
    },
    {
      icon: IoPhonePortrait,
      title: "Mobile Responsive",
      description: "Your portfolio looks great on any device - desktop, tablet, or mobile. Always make a professional impression."
    }
  ];

  return (
    <div id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Powerful Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md flex">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                <feature.icon className="text-primary-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;