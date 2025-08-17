import React from 'react';

interface ToolbarProps {
  onHelpClick: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onHelpClick }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 8L12 2L21 8M5 10V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 14H15M9 17H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-xl font-bold text-gray-800">ASCII Tree Editor</h1>
      </div>

      <button
        onClick={onHelpClick}
        className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
        title="Help"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 17V17.01M12 14V11C12 10.4477 12.4477 10 13 10C13.5523 10 14 9.55228 14 9C14 8.44772 13.5523 8 13 8H11C10.4477 8 10 8.44772 10 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-sm font-medium">Help</span>
      </button>
    </div>
  );
};
