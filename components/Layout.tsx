import React from 'react';
import { ToolType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTool, onToolChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4 lg:h-20 gap-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => onToolChange(ToolType.PDF_TO_IMAGE)}
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter italic">SUPER<span className="text-blue-600">TOOL</span></span>
            </div>
            
            <nav className="flex items-center bg-gray-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
              <button
                onClick={() => onToolChange(ToolType.PDF_TO_IMAGE)}
                className={`whitespace-nowrap flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs md:text-sm font-black transition-all ${
                  activeTool === ToolType.PDF_TO_IMAGE
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                PDF TO IMAGE
              </button>
              <button
                onClick={() => onToolChange(ToolType.TIKTOK_DOWNLOADER)}
                className={`whitespace-nowrap flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs md:text-sm font-black transition-all ${
                  activeTool === ToolType.TIKTOK_DOWNLOADER
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                TIKTOK DL
              </button>
              <button
                onClick={() => onToolChange(ToolType.PRICING)}
                className={`whitespace-nowrap flex-1 lg:flex-none px-6 py-2 rounded-lg text-xs md:text-sm font-black transition-all ${
                  activeTool === ToolType.PRICING
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                BẢNG GIÁ
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center space-x-6 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Liên hệ</a>
          </div>
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SuperTool Utilities. Powered by Web Tech.
          </p>
        </div>
      </footer>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};