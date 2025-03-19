'use client';

import Tooltip from '@/components/ui/Tooltip';

interface HeaderProps {
  onHelpClick?: () => void;
}

export default function Header({ onHelpClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">AI Fashion Model Generator</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 hidden sm:inline">Powered by Gemini AI</span>
          
          {/* Help button */}
          <Tooltip content="Help & Keyboard Shortcuts (Press / key)">
            <button 
              onClick={onHelpClick}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              aria-label="Help and keyboard shortcuts"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z"></path>
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
