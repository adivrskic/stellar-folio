import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingScreen from '../components/common/LoadingScreen';
import { IoSaveOutline, IoEyeOutline, IoTrashOutline, IoAlertCircleOutline } from 'react-icons/io5';

// Template imports 
import TechMinimal from '../templates/tech/TechMinimal';
import TechModern from '../templates/tech/TechModern';
import DesignPortfolio from '../templates/design/DesignPortfolio';

const PortfolioEditorPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [formData, setFormData] = useState({
    basicInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      github: '',
      portfolio: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });
  const [templateSettings, setTemplateSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState(null);
  
  const { id: portfolioId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        
        if (!portfolioId) return;
        
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('id', portfolioId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        if (!data) throw new Error('Portfolio not found');
        
        setPortfolio(data);
        
        // Initialize form data from resume data
        if (data.resume_data) {
          setFormData(data.resume_data);
        }
        
        // Initialize template settings
        if (data.template_settings) {
          setTemplateSettings(data.template_settings);
        } else {
          // Default template settings based on template
          setTemplateSettings(getDefaultTemplateSettings(data.template));
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [portfolioId, user]);
  
  // Get default template settings based on template ID
  const getDefaultTemplateSettings = (templateId) => {
    if (!templateId) return {};
    
    switch (templateId) {
      case 'tech-minimal':
        return {
          primaryColor: '#6d28d9',
          secondaryColor: '#4f46e5',
          fontPrimary: "'Inter', sans-serif",
          fontSecondary: "'Inter', sans-serif",
          showAvatar: true,
          darkMode: false,
        };
      case 'tech-modern':
        return {
          primaryColor: '#0ea5e9',
          secondaryColor: '#6366f1',
          accentColor: '#10b981',
          fontPrimary: "'Source Sans Pro', sans-serif",
          fontSecondary: "'Fira Code', monospace",
          darkMode: true,
          codeTheme: 'monokai',
          showSkillBars: true,
        };
      case 'design-portfolio':
        return {
          primaryColor: '#ec4899',
          secondaryColor: '#8b5cf6',
          accentColor: '#f97316',
          fontPrimary: "'Poppins', sans-serif",
          fontSecondary: "'Playfair Display', serif",
          showHero: true,
          darkMode: false,
          gridLayout: 'masonry',
        };
      default:
        return {};
    }
  };
  
  // Render the selected template
  const renderTemplate = () => {
    if (!portfolio || !portfolio.template) return null;
    
    // Template props
    const templateProps = {
      data: formData,
      settings: templateSettings,
    };
    
    // Render the appropriate template
    switch (portfolio.template) {
      case 'tech-minimal':
        return <TechMinimal {...templateProps} />;
      case 'tech-modern':
        return <TechModern {...templateProps} />;
      case 'design-portfolio':
        return <DesignPortfolio {...templateProps} />;
      default:
        return <div className="p-4 bg-red-50 text-red-700 rounded">Template not found</div>;
    }
  };
  
  // Handle form input change
  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prevData => {
      // Deep clone the previous data
      const newData = JSON.parse(JSON.stringify(prevData));
      
      if (index === null) {
        // Update a field in a simple section (like basicInfo)
        newData[section][field] = value;
      } else {
        // Update a field in an array section (like experience)
        newData[section][index][field] = value;
      }
      
      return newData;
    });
  };
  
  // Add a new item to an array section (experience, education, projects)
  const handleAddItem = (section) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      switch (section) {
        case 'experience':
          newData.experience = [
            ...newData.experience,
            { title: '', company: '', date: '', description: '' }
          ];
          break;
        case 'education':
          newData.education = [
            ...newData.education,
            { institution: '', degree: '', date: '' }
          ];
          break;
        case 'projects':
          newData.projects = [
            ...newData.projects,
            { 
              name: '', 
              description: '', 
              link: '',
              technologies: []
            }
          ];
          break;
        case 'skills':
          newData.skills = [...newData.skills, ''];
          break;
      }
      
      return newData;
    });
  };
  
  // Remove an item from an array section
  const handleRemoveItem = (section, index) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      newData[section] = newData[section].filter((_, i) => i !== index);
      return newData;
    });
  };
  
  // Handle template setting change
  const handleSettingChange = (key, value) => {
    setTemplateSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  };
  
  // Save portfolio changes
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('portfolios')
        .update({
          resume_data: formData,
          template_settings: templateSettings,
        })
        .eq('id', portfolioId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Reset error state
      setError(null);
    } catch (err) {
      console.error('Error saving portfolio:', err);
      setError('Failed to save portfolio. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Navigate to preview page
  const handlePreview = () => {
    navigate(`/dashboard/preview/${portfolioId}`);
  };


  // Render basic info form
  const renderBasicInfoForm = () => (
    <div className="space-y-4">
      <Input
        label="Full Name"
        value={formData.basicInfo.name}
        onChange={(e) => handleInputChange('basicInfo', 'name', e.target.value)}
        placeholder="Your full name"
      />
      
      <Input
        label="Professional Title"
        value={formData.basicInfo.title}
        onChange={(e) => handleInputChange('basicInfo', 'title', e.target.value)}
        placeholder="e.g. Full Stack Developer"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.basicInfo.email}
          onChange={(e) => handleInputChange('basicInfo', 'email', e.target.value)}
          placeholder="your.email@example.com"
        />
        
        <Input
          label="Phone"
          value={formData.basicInfo.phone}
          onChange={(e) => handleInputChange('basicInfo', 'phone', e.target.value)}
          placeholder="(123) 456-7890"
        />
      </div>
      
      <Input
        label="Location"
        value={formData.basicInfo.location}
        onChange={(e) => handleInputChange('basicInfo', 'location', e.target.value)}
        placeholder="City, State"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="LinkedIn URL"
          value={formData.basicInfo.linkedIn}
          onChange={(e) => handleInputChange('basicInfo', 'linkedIn', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        
        <Input
          label="GitHub URL"
          value={formData.basicInfo.github}
          onChange={(e) => handleInputChange('basicInfo', 'github', e.target.value)}
          placeholder="https://github.com/yourusername"
        />
      </div>
      
      <Input
        label="Portfolio/Website URL"
        value={formData.basicInfo.portfolio}
        onChange={(e) => handleInputChange('basicInfo', 'portfolio', e.target.value)}
        placeholder="https://yourwebsite.com"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary
        </label>
        <textarea
          value={formData.basicInfo.summary}
          onChange={(e) => handleInputChange('basicInfo', 'summary', e.target.value)}
          placeholder="A brief overview of your professional background and strengths"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          rows={4}
        />
      </div>
    </div>
  );

  // Render experience form
  const renderExperienceForm = () => (
    <div className="space-y-6">
      {formData.experience.map((job, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-50 relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => handleRemoveItem('experience', index)}
          >
            <IoTrashOutline size={18} />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Job Title"
              value={job.title}
              onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
              placeholder="e.g. Senior Developer"
            />
            
            <Input
              label="Company"
              value={job.company}
              onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
              placeholder="Company Name"
            />
          </div>
          
          <Input
            label="Date Range"
            value={job.date}
            onChange={(e) => handleInputChange('experience', 'date', e.target.value, index)}
            placeholder="e.g. Jan 2020 - Present"
            className="mb-4"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              value={job.description}
              onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
              placeholder="Describe your responsibilities and achievements"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              rows={3}
            />
          </div>
        </div>
      ))}
      
      <div className="text-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleAddItem('experience')}
        >
          Add Work Experience
        </Button>
      </div>
    </div>
  );

  // Render education form
  const renderEducationForm = () => (
    <div className="space-y-6">
      {formData.education.map((edu, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-50 relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => handleRemoveItem('education', index)}
          >
            <IoTrashOutline size={18} />
          </button>
          
          <Input
            label="Institution"
            value={edu.institution}
            onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
            placeholder="University or School Name"
            className="mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Degree"
              value={edu.degree}
              onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
              placeholder="e.g. Bachelor of Science in Computer Science"
            />
            
            <Input
              label="Date Range"
              value={edu.date}
              onChange={(e) => handleInputChange('education', 'date', e.target.value, index)}
              placeholder="e.g. 2016 - 2020"
            />
          </div>
        </div>
      ))}
      
      <div className="text-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleAddItem('education')}
        >
          Add Education
        </Button>
      </div>
    </div>
  );

  // Render skills form
  const renderSkillsForm = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Add your technical skills, tools, languages, frameworks, and other relevant skills.
      </p>
      
      {formData.skills.map((skill, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={skill}
            onChange={(e) => handleInputChange('skills', index, e.target.value)}
            placeholder="e.g. JavaScript"
            className="flex-grow"
          />
          <button
            type="button"
            className="text-red-500 hover:text-red-700 p-2"
            onClick={() => handleRemoveItem('skills', index)}
          >
            <IoTrashOutline size={18} />
          </button>
        </div>
      ))}
      
      <div className="text-center mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleAddItem('skills')}
        >
          Add Skill
        </Button>
      </div>
    </div>
  );

  // Render projects form
  const renderProjectsForm = () => (
    <div className="space-y-6">
      {formData.projects.map((project, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-50 relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => handleRemoveItem('projects', index)}
          >
            <IoTrashOutline size={18} />
          </button>
          
          <Input
            label="Project Name"
            value={project.name}
            onChange={(e) => handleInputChange('projects', 'name', e.target.value, index)}
            placeholder="Project Name"
            className="mb-4"
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
              placeholder="Describe your project, its features, and your role in it"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              rows={3}
            />
          </div>
          
          <Input
            label="Project Link"
            value={project.link}
            onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)}
            placeholder="e.g. https://github.com/username/project"
            className="mb-4"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.technologies?.map((tech, techIndex) => (
                <div 
                  key={techIndex}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    className="ml-1 text-blue-700 hover:text-blue-900"
                    onClick={() => {
                      const newTechnologies = [...project.technologies];
                      newTechnologies.splice(techIndex, 1);
                      handleInputChange('projects', 'technologies', newTechnologies, index);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. React"
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    const newTech = e.target.value.trim();
                    const currentTechs = project.technologies || [];
                    handleInputChange('projects', 'technologies', [...currentTechs, newTech], index);
                    e.target.value = '';
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousSibling;
                  if (input.value.trim()) {
                    const newTech = input.value.trim();
                    const currentTechs = project.technologies || [];
                    handleInputChange('projects', 'technologies', [...currentTechs, newTech], index);
                    input.value = '';
                  }
                }}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to add a technology after typing
            </p>
          </div>
        </div>
      ))}
      
      <div className="text-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleAddItem('projects')}
        >
          Add Project
        </Button>
      </div>
    </div>
  );

    // Render template settings form
    const renderTemplateSettingsForm = () => {
      // Get settings specific to the current template
      const template = portfolio?.template || '';
      
      const commonSettings = (
        <>
          <h3 className="font-medium text-lg mb-4">Common Settings</h3>
          
          {/* Color settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={templateSettings.primaryColor || '#6d28d9'}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={templateSettings.primaryColor || '#6d28d9'}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  className="flex-grow"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={templateSettings.secondaryColor || '#4f46e5'}
                  onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={templateSettings.secondaryColor || '#4f46e5'}
                  onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                  className="flex-grow"
                />
              </div>
            </div>
            
            {templateSettings.accentColor !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={templateSettings.accentColor || '#10b981'}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={templateSettings.accentColor || '#10b981'}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    className="flex-grow"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Font settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Font
              </label>
              <select
                value={templateSettings.fontPrimary || "'Inter', sans-serif"}
                onChange={(e) => handleSettingChange('fontPrimary', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                <option value="'Roboto', sans-serif">Roboto (Sans-serif)</option>
                <option value="'Open Sans', sans-serif">Open Sans (Sans-serif)</option>
                <option value="'Poppins', sans-serif">Poppins (Sans-serif)</option>
                <option value="'Merriweather', serif">Merriweather (Serif)</option>
                <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                <option value="'Fira Code', monospace">Fira Code (Monospace)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Font
              </label>
              <select
                value={templateSettings.fontSecondary || "'Inter', sans-serif"}
                onChange={(e) => handleSettingChange('fontSecondary', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                <option value="'Roboto', sans-serif">Roboto (Sans-serif)</option>
                <option value="'Open Sans', sans-serif">Open Sans (Sans-serif)</option>
                <option value="'Poppins', sans-serif">Poppins (Sans-serif)</option>
                <option value="'Merriweather', serif">Merriweather (Serif)</option>
                <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                <option value="'Fira Code', monospace">Fira Code (Monospace)</option>
              </select>
            </div>
          </div>
          
          {/* Dark mode */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                checked={templateSettings.darkMode || false}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                Dark Mode
              </label>
            </div>
          </div>
        </>
      );
      
      // Template specific settings
      let templateSpecificSettings = null;
      
      if (template === 'tech-minimal') {
        templateSpecificSettings = (
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-4">Tech Minimal Settings</h3>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showAvatar"
                checked={templateSettings.showAvatar || false}
                onChange={(e) => handleSettingChange('showAvatar', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="showAvatar" className="ml-2 block text-sm text-gray-700">
                Show Avatar
              </label>
            </div>
          </div>
        );
      } else if (template === 'tech-modern') {
        templateSpecificSettings = (
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-4">Tech Modern Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code Theme
                </label>
                <select
                  value={templateSettings.codeTheme || 'monokai'}
                  onChange={(e) => handleSettingChange('codeTheme', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="monokai">Monokai</option>
                  <option value="github">GitHub</option>
                  <option value="dracula">Dracula</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showSkillBars"
                checked={templateSettings.showSkillBars || false}
                onChange={(e) => handleSettingChange('showSkillBars', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="showSkillBars" className="ml-2 block text-sm text-gray-700">
                Show Skill Progress Bars
              </label>
            </div>
          </div>
        );
      } else if (template === 'design-portfolio') {
        templateSpecificSettings = (
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-4">Design Portfolio Settings</h3>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showHero"
                checked={templateSettings.showHero || false}
                onChange={(e) => handleSettingChange('showHero', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="showHero" className="ml-2 block text-sm text-gray-700">
                Show Hero Section
              </label>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Grid Layout
              </label>
              <select
                value={templateSettings.gridLayout || 'masonry'}
                onChange={(e) => handleSettingChange('gridLayout', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="masonry">Masonry</option>
                <option value="grid">Grid</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>
          </div>
        );
      }
      
      return (
        <div>
          {commonSettings}
          {templateSpecificSettings}
        </div>
      );
    };

    // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfoForm();
      case 'experience':
        return renderExperienceForm();
      case 'education':
        return renderEducationForm();
      case 'skills':
        return renderSkillsForm();
      case 'projects':
        return renderProjectsForm();
      case 'settings':
        return renderTemplateSettingsForm();
      default:
        return renderBasicInfoForm();
    }
  };
  
  // Main render
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <IoAlertCircleOutline size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
          <p className="text-gray-600 mb-6">
            The portfolio you're looking for doesn't exist or you don't have permission to access it.
          </p>
          <Button
            variant="primary"
            to="/dashboard"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Portfolio: {portfolio.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your portfolio content and appearance
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={saving}
          >
            <IoSaveOutline size={20} className="mr-1" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          
          <Button
            variant="primary"
            onClick={handlePreview}
          >
            <IoEyeOutline size={20} className="mr-1" />
            Preview
          </Button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <IoAlertCircleOutline size={20} className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side - Navigation and Form */}
        <div className="md:col-span-1">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex flex-col">
              <button
                className={`text-left px-4 py-3 border-l-4 transition ${
                  activeTab === 'basic'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Information
              </button>
              
              <button
                className={`text-left px-4 py-3 border-l-4 transition ${
                  activeTab === 'experience'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('experience')}
              >
                Experience
              </button>
              
              <button
                className={`text-left px-4 py-3 border-l-4 transition ${
                  activeTab === 'education'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('education')}
              >
                Education
              </button>
              
              <button
                className={`text-left px-4 py-3 border-l-4 transition ${
                  activeTab === 'skills'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('skills')}
              >
                Skills
              </button>
              
              <button
                className={`text-left px-4 py-3 border-l-4 transition ${
                  activeTab === 'projects'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              
              <button
                className={`text-left px-4 py-3 border-l-4 transition ${
                  activeTab === 'settings'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                Template Settings
              </button>
            </div>
          </div>
          
          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderTabContent()}
          </div>
        </div>
        
        {/* Right side - Preview */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="w-full h-full overflow-auto border border-gray-200 rounded">
              {/* Preview toggle button */}
              <div className="sticky top-0 z-10 p-2 bg-white border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Live Preview</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? 'Exit Full Preview' : 'Full Preview'}
                  </Button>
                </div>
              </div>
              
              {/* Template preview */}
              <div className={`${previewMode ? 'w-full' : 'w-[1024px] mx-auto'} transform transition-transform duration-300`}>
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditorPage;