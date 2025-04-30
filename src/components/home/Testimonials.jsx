import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "UX Designer",
      image: "/images/testimonials/sarah.jpg",
      content: "PortfolioBuilder helped me land my dream job at a top tech company. The sleek design templates and easy customization made my portfolio stand out from the crowd. I received three job offers within a week of sharing my portfolio link!"
    },
    {
      name: "Michael Chen",
      role: "Full Stack Developer",
      image: "/images/testimonials/michael.jpg",
      content: "As a developer, I was skeptical about using a template-based solution, but PortfolioBuilder surprised me. The tech-focused templates are clean, modern, and highlight my projects perfectly. The code snippet sections are a game-changer."
    },
    {
      name: "Jessica Williams",
      role: "Marketing Director",
      image: "/images/testimonials/jessica.jpg",
      content: "After 15 years in marketing, I needed a portfolio that showcased my experience while feeling contemporary. PortfolioBuilder delivered exactly what I needed. The analytics feature also gives me insights into who's viewing my work."
    },
    {
      name: "David Rodriguez",
      role: "Graphic Designer",
      image: "/images/testimonials/david.jpg",
      content: "The design-focused templates on PortfolioBuilder are actually good! As a designer, I have high standards for visual presentation, and I was able to create a portfolio that I'm proud to share with clients. Worth every penny."
    }
  ];
  
  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Handle indicator click
  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div id="testimonials" className="py-20 bg-gradient-to-r from-primary-500 to-secondary-700 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
        
        <div className="max-w-4xl mx-auto">
          {/* Testimonial slider */}
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 ${
                  index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 absolute top-0 left-0 right-0'
                }`}
              >
                <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="shrink-0">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white"
                      />
                    </div>
                    <div>
                      <p className="text-lg mb-4">"{testimonial.content}"</p>
                      <div>
                        <h4 className="text-xl font-bold">{testimonial.name}</h4>
                        <p className="text-sm opacity-80">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition ${
                  index === activeIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;