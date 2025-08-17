import React from 'react';
import { Button } from '../styles/components';

interface ToolbarProps {
  onLoadClick: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onLoadClick }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
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

      <Button onClick={onLoadClick}>Load Output</Button>
    </div>
  );
};
