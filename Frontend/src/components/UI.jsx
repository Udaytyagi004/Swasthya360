import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  className = '', 
  disabled = false,
  fullWidth = false
}) => {
  const baseStyles = 'px-6 py-2.5 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border-2 border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-500',
    ghost: 'text-slate-500 hover:text-orange-500 hover:bg-orange-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name, 
  required = false,
  className = '',
  icon: Icon
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400`}
        />
      </div>
    </div>
  );
};

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ${hover ? 'hover:shadow-md dark:hover:shadow-orange-900/10 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};
