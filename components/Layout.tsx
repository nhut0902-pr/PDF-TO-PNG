
import React from 'react';
import { ToolType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTool, onToolChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">SuperTool</span>
            </div>
            
            <nav className="flex space-x-4">
              <button
                onClick={() => onToolChange(ToolType.PDF_TO_IMAGE)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTool === ToolType.PDF_TO_IMAGE
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                PDF to Image
              </button>
              <button
                onClick={() => onToolChange(ToolType.TIKTOK_DOWNLOADER)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTool === ToolType.TIKTOK_DOWNLOADER
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                TikTok Downloader
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SuperTool. Created for Efficiency.
        </div>
      </footer>
    </div>
  );
};
