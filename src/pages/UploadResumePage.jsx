import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../context/AuthContext';
import parseResume from '../utils/resumeParser';
import { 
  IoCloudUploadOutline, 
  IoDocumentTextOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import Button from '../components/common/Button';

const UploadResumePage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [portfolioName, setPortfolioName] = useState('');
  
  const { user, userSubscription, canCreatePortfolio } = useAuth();
  const navigate = useNavigate();
  
  // Check if user can create a new portfolio
  const canUpload = canCreatePortfolio();
  
  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles) => {
    // Reset state
    setError(null);
    setUploadProgress(0);
    setParsedData(null);
    
    const selectedFile = acceptedFiles[0];
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }
    
    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setFile(selectedFile);
    
    // Suggest a portfolio name from the file name
    const fileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
    setPortfolioName(fileName);
    
    // Start parsing the resume
    try {
      setIsUploading(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Parse resume
      const data = await parseResume(selectedFile);
      setParsedData(data);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError('Failed to parse resume. Please check the file format and try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);
  
  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isUploading || !canUpload
  });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !parsedData || !portfolioName.trim()) {
      setError('Please upload a resume and provide a portfolio name');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Save resume data to Supabase
      const { data, error } = await supabase
        .from('portfolios')
        .insert([
          {
            user_id: user.id,
            name: portfolioName.trim(),
            resume_data: parsedData,
            template: null, // Will be chosen in the next step
            template_settings: {},
            deployed: false,
            created_at: new Date().toISOString()
          }
        ])
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Increment the user's portfolio count
      await supabase
        .from('subscriptions')
        .update({ current_usage: userSubscription.current_usage + 1 })
        .eq('user_id', user.id);
      
      // Navigate to template selection
      navigate('/dashboard/templates', { state: { portfolioId: data.id } });
    } catch (err) {
      console.error('Error saving portfolio:', err);
      setError('Failed to save portfolio. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Reset form
  const handleReset = () => {
    setFile(null);
    setUploadProgress(0);
    setParsedData(null);
    setPortfolioName('');
    setError(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
        <p className="text-gray-600">
          Upload your resume to create a new portfolio. We'll extract your information automatically.
        </p>
      </div>
      
      {!canUpload ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <IoAlertCircleOutline size={24} className="text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-bold text-red-800 mb-1">Portfolio Limit Reached</h3>
              <p className="text-red-700 mb-4">
                You've reached the maximum number of portfolios for your current plan. 
                Upgrade to create more.
              </p>
              <Button 
                to="/pricing"
                variant="primary"
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* File upload area */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resume Upload</h2>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'
              } ${isUploading || !canUpload ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-t-primary-600 animate-spin"
                      style={{ 
                        clipPath: `polygon(0 0, 100% 0, 100% ${uploadProgress}%, 0 ${uploadProgress}%)` 
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600">Parsing resume...</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <IoDocumentTextOutline size={32} className="text-primary-600" />
                  </div>
                  <p className="font-medium mb-1">{file.name}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {parsedData ? (
                    <div className="flex items-center text-green-600">
                      <IoCheckmarkCircleOutline size={20} className="mr-1" />
                      <span>Resume parsed successfully</span>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                    >
                      Remove File
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <IoCloudUploadOutline size={32} className="text-gray-400" />
                  </div>
                  <p className="font-medium mb-1">Drag & drop your resume here</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Or click to browse files (PDF, DOC, DOCX)
                  </p>
                  <p className="text-xs text-gray-400">
                    Maximum file size: 5MB
                  </p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 bg-red-50 p-3 rounded-md text-red-700 text-sm">
                <div className="flex items-center">
                  <IoAlertCircleOutline size={18} className="mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Portfolio info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Name
                </label>
                <input
                  type="text"
                  id="portfolioName"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="My Professional Portfolio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={!file || isUploading}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  This will be the title of your portfolio website
                </p>
              </div>
              
              {parsedData && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Resume Overview</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium">
                          {parsedData.basicInfo?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium">
                          {parsedData.basicInfo?.email || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium">
                          {parsedData.basicInfo?.phone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium">
                          {parsedData.basicInfo?.location || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="text-sm font-medium">
                        {parsedData.experience && parsedData.experience.length > 0
                          ? `${parsedData.experience.length} entries found`
                          : 'No work experience found'
                        }
                      </p>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Education</p>
                      <p className="text-sm font-medium">
                        {parsedData.education && parsedData.education.length > 0
                          ? `${parsedData.education.length} entries found`
                          : 'No education history found'
                        }
                      </p>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Skills</p>
                      <p className="text-sm font-medium">
                        {parsedData.skills && parsedData.skills.length > 0
                          ? `${parsedData.skills.length} skills found`
                          : 'No skills found'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-500">
                    You'll be able to edit and enhance this information in the next step.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!file || isUploading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!parsedData || isUploading}
                >
                  {isUploading ? 'Creating Portfolio...' : 'Continue to Templates'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Tips and FAQ */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-3">Tips for Best Results</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="inline-block w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs mt-0.5 mr-2">•</span>
            <span className="text-sm text-gray-700">
              Use a clean, well-formatted resume free of graphics and tables
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs mt-0.5 mr-2">•</span>
            <span className="text-sm text-gray-700">
              Ensure your contact information is clearly visible at the top
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs mt-0.5 mr-2">•</span>
            <span className="text-sm text-gray-700">
              Have clear section headings (Experience, Education, Skills, etc.)
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs mt-0.5 mr-2">•</span>
            <span className="text-sm text-gray-700">
              Don't worry if some information isn't detected - you can add it later
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadResumePage;