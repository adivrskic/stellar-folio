import React from 'react';
import { IoLogoGithub, IoLogoLinkedin, IoMail, IoCall, IoGlobe, IoLocation } from 'react-icons/io5';

/**
 * Tech Minimal Portfolio Template
 * A clean, minimal template for tech professionals
 * 
 * @param {Object} props
 * @param {Object} props.data - The portfolio data
 * @param {Object} props.settings - Template settings
 */
const TechMinimal = ({ data, settings = {} }) => {
  // Default settings
  const defaultSettings = {
    primaryColor: '#6d28d9', // Default: purple-700
    secondaryColor: '#4f46e5', // Default: indigo-600
    fontPrimary: "'Inter', sans-serif",
    fontSecondary: "'Inter', sans-serif",
    showAvatar: true,
    darkMode: false,
    accentColor: '#8b5cf6', // Default: purple-500
  };

  // Merge default settings with custom settings
  const mergedSettings = { ...defaultSettings, ...settings };
  
  // Extract data
  const { basicInfo, experience, education, skills, projects } = data;
  
  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a 10-digit US number
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Otherwise return as is
    return phone;
  };
  
  // Background and text colors based on dark mode setting
  const bgColor = mergedSettings.darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = mergedSettings.darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = mergedSettings.darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = mergedSettings.darkMode ? 'border-gray-700' : 'border-gray-200';
  const sectionBgColor = mergedSettings.darkMode ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <div 
      className={`min-h-screen ${bgColor} ${textColor}`}
      style={{ fontFamily: mergedSettings.fontPrimary }}
    >
      {/* Header */}
      <header className="w-full py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar (conditionally rendered) */}
            {mergedSettings.showAvatar && (
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4"
                style={{ borderColor: mergedSettings.primaryColor }}
              >
                <img 
                  src={basicInfo.avatar || 'https://via.placeholder.com/128?text=Avatar'} 
                  alt={basicInfo.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Name and info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{basicInfo.name || 'Your Name'}</h1>
              <p 
                className="text-xl mb-4"
                style={{ color: mergedSettings.secondaryColor }}
              >
                {basicInfo.title || 'Professional Title'}
              </p>
              <p className={`${textSecondary} mb-4 max-w-2xl`}>
                {basicInfo.summary || 'A brief professional summary about yourself and your work experience.'}
              </p>
              
              {/* Contact info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {basicInfo.email && (
                  <a 
                    href={`mailto:${basicInfo.email}`} 
                    className="flex items-center gap-1 hover:underline"
                    style={{ color: mergedSettings.accentColor }}
                  >
                    <IoMail />
                    <span>{basicInfo.email}</span>
                  </a>
                )}
                
                {basicInfo.phone && (
                  <a 
                    href={`tel:${basicInfo.phone}`} 
                    className="flex items-center gap-1 hover:underline"
                    style={{ color: mergedSettings.accentColor }}
                  >
                    <IoCall />
                    <span>{formatPhone(basicInfo.phone)}</span>
                  </a>
                )}
                
                {basicInfo.location && (
                  <div 
                    className="flex items-center gap-1"
                    style={{ color: mergedSettings.accentColor }}
                  >
                    <IoLocation />
                    <span>{basicInfo.location}</span>
                  </div>
                )}
                
                {basicInfo.linkedIn && (
                  <a 
                    href={basicInfo.linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                    style={{ color: mergedSettings.accentColor }}
                  >
                    <IoLogoLinkedin />
                    <span>LinkedIn</span>
                  </a>
                )}
                
                {basicInfo.github && (
                  <a 
                    href={basicInfo.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                    style={{ color: mergedSettings.accentColor }}
                  >
                    <IoLogoGithub />
                    <span>GitHub</span>
                  </a>
                )}
                
                {basicInfo.portfolio && (
                  <a 
                    href={basicInfo.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                    style={{ color: mergedSettings.accentColor }}
                  >
                    <IoGlobe />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          {/* Skills */}
          <section className="mb-12">
            <h2 
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ 
                borderColor: mergedSettings.primaryColor,
                color: mergedSettings.primaryColor 
              }}
            >
              Skills
            </h2>
            
            {skills && skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mergedSettings.darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                    style={{ color: mergedSettings.secondaryColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className={textSecondary}>No skills listed.</p>
            )}
          </section>
          
          {/* Experience */}
          <section className="mb-12">
            <h2 
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ 
                borderColor: mergedSettings.primaryColor,
                color: mergedSettings.primaryColor 
              }}
            >
              Experience
            </h2>
            
            {experience && experience.length > 0 ? (
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className={`p-6 rounded-lg ${sectionBgColor}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <h3 className="text-xl font-bold">{job.title || 'Job Title'}</h3>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: mergedSettings.accentColor }}
                      >
                        {job.date || 'Date Range'}
                      </span>
                    </div>
                    <p 
                      className="text-lg mb-3"
                      style={{ color: mergedSettings.secondaryColor }}
                    >
                      {job.company || 'Company Name'}
                    </p>
                    <p className={textSecondary}>
                      {job.description || 'Job description and responsibilities.'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={textSecondary}>No experience listed.</p>
            )}
          </section>
          
          {/* Projects */}
          <section className="mb-12">
            <h2 
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ 
                borderColor: mergedSettings.primaryColor,
                color: mergedSettings.primaryColor 
              }}
            >
              Projects
            </h2>
            
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <div 
                    key={index} 
                    className={`p-6 rounded-lg border ${sectionBgColor} ${borderColor}`}
                  >
                    <h3 className="text-xl font-bold mb-2">{project.name || 'Project Name'}</h3>
                    <p className={`${textSecondary} mb-4`}>
                      {project.description || 'Project description and key features.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies && project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{ 
                            backgroundColor: mergedSettings.darkMode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)',
                            color: mergedSettings.secondaryColor 
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm font-medium hover:underline"
                        style={{ color: mergedSettings.accentColor }}
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={textSecondary}>No projects listed.</p>
            )}
          </section>
          
          {/* Education */}
          <section>
            <h2 
              className="text-2xl font-bold mb-6 pb-2 border-b"
              style={{ 
                borderColor: mergedSettings.primaryColor,
                color: mergedSettings.primaryColor 
              }}
            >
              Education
            </h2>
            
            {education && education.length > 0 ? (
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className={`p-6 rounded-lg ${sectionBgColor}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <h3 className="text-xl font-bold">{edu.institution || 'Institution Name'}</h3>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: mergedSettings.accentColor }}
                      >
                        {edu.date || 'Date Range'}
                      </span>
                    </div>
                    <p 
                      className="text-lg"
                      style={{ color: mergedSettings.secondaryColor }}
                    >
                      {edu.degree || 'Degree and Field of Study'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={textSecondary}>No education listed.</p>
            )}
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-6 px-4 mt-8 text-center text-sm ${textSecondary}`}>
        <p>© {new Date().getFullYear()} {basicInfo.name || 'Your Name'} • Built with PortfolioBuilder</p>
      </footer>
    </div>
  );
};

export default TechMinimal;