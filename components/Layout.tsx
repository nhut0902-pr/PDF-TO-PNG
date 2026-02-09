
import React from 'react';
import { ToolType, Language, Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  theme: Theme;
  onToggleTheme: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTool, 
  onToolChange, 
  theme, 
  onToggleTheme, 
  language, 
  onToggleLanguage 
}) => {
  const t = {
    vi: {
      pdf: 'PDF',
      tiktok: 'TIKTOK',
      reward: 'NHẬN THƯỞNG',
      pricing: 'BẢNG GIÁ',
      terms: 'Điều khoản',
      privacy: 'Bảo mật',
      contact: 'Liên hệ',
    },
    en: {
      pdf: 'PDF',
      tiktok: 'TIKTOK',
      reward: 'REWARDS',
      pricing: 'PRICING',
      terms: 'Terms',
      privacy: 'Privacy',
      contact: 'Contact',
    }
  }[language];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4 lg:h-20 gap-4">
            <div className="flex items-center justify-between w-full lg:w-auto">
              <div 
                className="flex items-center space-x-3 cursor-pointer" 
                onClick={() => onToolChange(ToolType.PDF_TO_IMAGE)}
              >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">SUPER<span className="text-blue-600">TOOL</span></span>
              </div>

              <div className="flex items-center space-x-2 lg:hidden">
                <button onClick={onToggleLanguage} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">
                  {language === 'vi' ? 'VN' : 'EN'}
                </button>
                <button onClick={onToggleTheme} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <nav className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                <button
                  onClick={() => onToolChange(ToolType.PDF_TO_IMAGE)}
                  className={`whitespace-nowrap flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    activeTool === ToolType.PDF_TO_IMAGE
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t.pdf}
                </button>
                <button
                  onClick={() => onToolChange(ToolType.TIKTOK_DOWNLOADER)}
                  className={`whitespace-nowrap flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    activeTool === ToolType.TIKTOK_DOWNLOADER
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t.tiktok}
                </button>
                <button
                  onClick={() => onToolChange(ToolType.REWARD_CENTER)}
                  className={`whitespace-nowrap flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    activeTool === ToolType.REWARD_CENTER
                      ? 'bg-white dark:bg-slate-700 text-amber-500 dark:text-amber-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t.reward}
                </button>
                <button
                  onClick={() => onToolChange(ToolType.PRICING)}
                  className={`whitespace-nowrap flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    activeTool === ToolType.PRICING
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t.pricing}
                </button>
              </nav>

              <div className="hidden lg:flex items-center space-x-2">
                <button onClick={onToggleLanguage} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  {language === 'vi' ? 'VI' : 'EN'}
                </button>
                <button onClick={onToggleTheme} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center items-center space-x-6 text-gray-400 dark:text-gray-500 font-bold text-[10px] uppercase tracking-widest">
            <button onClick={() => onToolChange(ToolType.TERMS)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase">{t.terms}</button>
            <button onClick={() => onToolChange(ToolType.PRIVACY)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase">{t.privacy}</button>
            <a href="mailto:lamminhnhut09022011@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.contact}</a>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <p className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-wider uppercase">
              Powered By <span className="text-blue-600">Nhutcoder</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
