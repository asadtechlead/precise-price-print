import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', withText = true, textClassName = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 13h.01" />
          <path d="M14 17h.01" />
          <path d="M10 17a3.5 3.5 0 0 0 4 0" />
        </svg>
      </div>
      {withText && (
        <span className={`font-bold text-xl ${textClassName}`}>
          InvoicePro
        </span>
      )}
    </div>
  );
};

export default Logo;
