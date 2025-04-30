import React from 'react';
import { Link } from 'react-router-dom';
import { IoLogoTwitter, IoLogoLinkedin, IoLogoGithub } from 'react-icons/io5';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white">
              PortfolioBuilder
            </Link>
            <p className="mt-4 text-gray-400">
              Transform your resume into a stunning portfolio website in minutes.
              Showcase your professional experience with customizable templates.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <a href="mailto:support@portfoliobuilder.com" className="hover:text-white transition">
                  support@portfoliobuilder.com
                </a>
              </li>
              <li className="text-gray-400">
                <a href="tel:+1234567890" className="hover:text-white transition">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex space-x-4 mt-4">
                <a 
                  href="https://twitter.com/portfoliobuilder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <IoLogoTwitter size={24} />
                </a>
                <a 
                  href="https://linkedin.com/company/portfoliobuilder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <IoLogoLinkedin size={24} />
                </a>
                <a 
                  href="https://github.com/portfoliobuilder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <IoLogoGithub size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {currentYear} PortfolioBuilder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;