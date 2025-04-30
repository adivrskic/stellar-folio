import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            PortfolioBuilder
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium ${
                location.pathname === '/' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className={`font-medium ${
                location.pathname === '/pricing' 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Pricing
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="font-medium text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="font-medium text-gray-700 hover:text-primary-600"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <IoCloseOutline size={28} />
            ) : (
              <IoMenuOutline size={28} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 invisible'
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            className={`font-medium py-2 ${
              location.pathname === '/' 
                ? 'text-primary-600' 
                : 'text-gray-700'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/pricing" 
            className={`font-medium py-2 ${
              location.pathname === '/pricing' 
                ? 'text-primary-600' 
                : 'text-gray-700'
            }`}
          >
            Pricing
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="font-medium py-2 text-gray-700"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary w-full"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="font-medium py-2 text-gray-700"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary w-full"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;