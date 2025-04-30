import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../context/AuthContext';
import Button from '../components/common/Button';
import { IoCheckmarkCircle, IoAlertCircleOutline } from 'react-icons/io5';

const TemplateSelectPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [portfolioId, setPortfolioId] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingTemplate, setSavingTemplate] = useState(false);
  
  const { user, isPaidUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Template categories
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'tech', name: 'Tech' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creative' },
    { id: 'academic', name: 'Academic' },
  ];
  
  // Template data
  const templates = [
    {
      id: 'tech-minimal',
      name: 'Tech Minimal',
      category: 'tech',
      description: 'Clean and minimal design perfect for developers and tech professionals.',
      image: '/images/templates/tech-minimal.jpg',
      premium: false,
    },
    {
      id: 'tech-modern',
      name: 'Tech Modern',
      category: 'tech',
      description: 'Modern layout with code snippets and skill visualization.',
      image: '/images/templates/tech-modern.jpg',
      premium: false,
    },
    {
      id: 'design-portfolio',
      name: 'Design Portfolio',
      category: 'design',
      description: 'Visual-first design to showcase your creative projects.',
      image: '/images/templates/design-portfolio.jpg',
      premium: false,
    },
    {
      id: 'design-minimal',
      name: 'Design Minimal',
      category: 'design',
      description: 'Clean whitespace with focus on typography and visuals.',
      image: '/images/templates/design-minimal.jpg',
      premium: true,
    },
    {
      id: 'business-professional',
      name: 'Business Professional',
      category: 'business',
      description: 'Traditional layout perfect for corporate and finance professionals.',
      image: '/images/templates/business-professional.jpg',
      premium: false,
    },
    {
      id: 'business-modern',
      name: 'Business Modern',
      category: 'business',
      description: 'Contemporary design for business professionals who want to stand out.',
      image: '/images/templates/business-modern.jpg',
      premium: true,
    },
    {
      id: 'creative-bold',
      name: 'Creative Bold',
      category: 'creative',
      description: 'Bold colors and typography for creative professionals.',
      image: '/images/templates/creative-bold.jpg',
      premium: false,
    },
    {
      id: 'creative-minimal',
      name: 'Creative Minimal',
      category: 'creative',
      description: 'Understated design that lets your creative work take center stage.',
      image: '/images/templates/creative-minimal.jpg',
      premium: true,
    },
    {
      id: 'academic-classic',
      name: 'Academic Classic',
      category: 'academic',
      description: 'Traditional layout for researchers and educators.',
      image: '/images/templates/academic-classic.jpg',
      premium: false,
    },
    {
      id: 'academic-modern',
      name: 'Academic Modern',
      category: 'academic',
      description: 'Contemporary design for academic professionals.',
      image: '/images/templates/academic-modern.jpg',
      premium: true,
    },
  ];
  
  // Initialize from URL query params or location state
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const templateIdFromQuery = queryParams.get('template');
    const portfolioIdFromQuery = queryParams.get('portfolioId');
    const portfolioIdFromState = location.state?.portfolioId;
    
    if (templateIdFromQuery) {
      setSelectedTemplate(templates.find(t => t.id === templateIdFromQuery) || null);
    }
    
    if (portfolioIdFromQuery || portfolioIdFromState) {
      setPortfolioId(portfolioIdFromQuery || portfolioIdFromState);
      fetchPortfolioData(portfolioIdFromQuery || portfolioIdFromState);
    }
  }, [location]);
  
  // Fetch portfolio data
  const fetchPortfolioData = async (id) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Portfolio not found');
      
      setPortfolioData(data);
      
      // If portfolio already has a template, select it
      if (data.template) {
        setSelectedTemplate(templates.find(t => t.id === data.template) || null);
      }
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to load portfolio data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter templates based on selected category
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(template => template.category === selectedCategory);
  
  // Handle template selection
  const handleTemplateSelect = (template) => {
    // Skip if it's a premium template and user doesn't have premium
    if (template.premium && !isPaidUser()) {
      return;
    }
    
    setSelectedTemplate(template);
  };
  
  // Handle continue button click
  const handleContinue = async () => {
    if (!selectedTemplate || !portfolioId) {
      setError('Please select a template to continue.');
      return;
    }
    
    try {
      setSavingTemplate(true);
      
      // Update portfolio with selected template
      const { error } = await supabase
        .from('portfolios')
        .update({ template: selectedTemplate.id })
        .eq('id', portfolioId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Navigate to editor page
      navigate(`/dashboard/editor/${portfolioId}`);
    } catch (err) {
      console.error('Error saving template selection:', err);
      setError('Failed to save template selection. Please try again.');
    } finally {
      setSavingTemplate(false);
    }
  };
  
  // Determine if the user can select a template
  const canSelectTemplate = (template) => {
    if (!template) return false;
    if (!template.premium) return true;
    return isPaidUser();
  };

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Choose a Template</h1>
        <p className="text-gray-600 mt-1">
          Select a template that best showcases your professional experience and skills.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <IoAlertCircleOutline size={20} className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Category filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition transform hover:shadow-lg ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-primary-500 shadow-lg'
                : 'hover:scale-[1.02]'
            } ${
              template.premium && !isPaidUser()
                ? 'opacity-60 cursor-not-allowed'
                : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            {/* Template image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/600x400?text=${template.name}`;
                }}
              />
              
              {template.premium && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                  PREMIUM
                </div>
              )}
              
              {selectedTemplate?.id === template.id && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2">
                    <IoCheckmarkCircle size={24} className="text-primary-600" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Template info */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 flex items-center justify-between">
                {template.name}
                <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </span>
              </h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              
              {template.premium && !isPaidUser() ? (
                <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded">
                  Upgrade to access premium templates
                </div>
              ) : (
                <button
                  className={`text-sm font-medium ${
                    selectedTemplate?.id === template.id
                      ? 'text-primary-700'
                      : 'text-primary-600 hover:text-primary-700'
                  }`}
                >
                  {selectedTemplate?.id === template.id ? 'Selected' : 'Select Template'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={!canSelectTemplate(selectedTemplate) || savingTemplate}
        >
          {savingTemplate ? 'Saving...' : 'Continue to Editor'}
        </Button>
      </div>
      
      {/* Premium upsell */}
      {!isPaidUser() && (
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Unlock Premium Templates</h3>
          <p className="text-gray-700 mb-4">
            Upgrade to a paid plan to access our exclusive premium templates designed by professional UI/UX designers.
          </p>
          <Button
            variant="primary"
            to="/pricing"
          >
            View Pricing Plans
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelectPage;