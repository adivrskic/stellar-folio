import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-primary-500'
        } focus:border-transparent transition ${
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;