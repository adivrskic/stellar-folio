import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TemplatesPreview = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'tech', name: 'Tech' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creative' },
    { id: 'academic', name: 'Academic' },
  ];
  
  const templates = [
    {
      id: 'tech-minimal',
      name: 'Tech Minimal',
      category: 'tech',
      image: '/images/templates/tech-minimal.jpg',
      description: 'Clean and minimal design perfect for developers and tech professionals.',
      featured: true,
    },
    {
      id: 'tech-modern',
      name: 'Tech Modern',
      category: 'tech',
      image: '/images/templates/tech-modern.jpg',
      description: 'Modern layout with code snippets and skill visualization.',
      featured: false,
    },
    {
      id: 'design-portfolio',
      name: 'Design Portfolio',
      category: 'design',
      image: '/images/templates/design-portfolio.jpg',
      description: 'Visual-first design to showcase your creative projects.',
      featured: true,
    },
    {
      id: 'design-minimal',
      name: 'Design Minimal',
      category: 'design',
      image: '/images/templates/design-minimal.jpg',
      description: 'Clean whitespace with focus on typography and visuals.',
      featured: false,
    },
    {
      id: 'business-professional',
      name: 'Business Professional',
      category: 'business',
      image: '/images/templates/business-professional.jpg',
      description: 'Traditional layout perfect for corporate and finance professionals.',
      featured: true,
    },
    {
      id: 'business-modern',
      name: 'Business Modern',
      category: 'business',
      image: '/images/templates/business-modern.jpg',
      description: 'Contemporary design for business professionals who want to stand out.',
      featured: false,
    },
    {
      id: 'creative-bold',
      name: 'Creative Bold',
      category: 'creative',
      image: '/images/templates/creative-bold.jpg',
      description: 'Bold colors and typography for creative professionals.',
      featured: true,
    },
    {
      id: 'creative-minimal',
      name: 'Creative Minimal',
      category: 'creative',
      image: '/images/templates/creative-minimal.jpg',
      description: 'Understated design that lets your creative work take center stage.',
      featured: false,
    },
    {
      id: 'academic-classic',
      name: 'Academic Classic',
      category: 'academic',
      image: '/images/templates/academic-classic.jpg',
      description: 'Traditional layout for researchers and educators.',
      featured: true,
    },
    {
      id: 'academic-modern',
      name: 'Academic Modern',
      category: 'academic',
      image: '/images/templates/academic-modern.jpg',
      description: 'Contemporary design for academic professionals.',
      featured: false,
    },
  ];
  
  // Filter templates based on active category
  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === activeCategory);
  
  return (
    <div id="templates" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Beautiful Templates</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose from our collection of professionally designed templates optimized for different industries and career levels.
        </p>
        
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full transition ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className={`bg-white rounded-lg overflow-hidden shadow-md transition hover:shadow-lg ${
                template.featured ? 'border-2 border-primary-500' : ''
              }`}
            >
              <div className="relative">
                <img 
                  src={template.image} 
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                {template.featured && (
                  <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {categories.find(cat => cat.id === template.category)?.name}
                  </span>
                  <Link 
                    to={`/dashboard/templates?preview=${template.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View all templates button */}
        <div className="mt-12 text-center">
          <Link
            to="/dashboard/templates"
            className="bg-primary-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-primary-700 transition"
          >
            View All Templates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPreview;