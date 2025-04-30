import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant specific classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };
  
  // Size specific classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Full width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`;
  
  // If 'to' prop is provided, render a Link component
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }
  
  // If 'href' prop is provided, render an anchor tag
  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {children}
      </a>
    );
  }
  
  // Otherwise, render a button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;