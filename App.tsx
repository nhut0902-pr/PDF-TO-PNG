import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PDFConverter } from './components/PDFConverter';
import { TikTokDownloader } from './components/TikTokDownloader';
import { Pricing } from './components/Pricing';
import { ToolType, Language, Theme } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.PDF_TO_IMAGE);
  const [language, setLanguage] = useState<Language>('vi');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      return saved || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(prev => prev === 'vi' ? 'en' : 'vi');

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.PDF_TO_IMAGE:
        return <PDFConverter language={language} />;
      case ToolType.TIKTOK_DOWNLOADER:
        return <TikTokDownloader language={language} />;
      case ToolType.PRICING:
        return <Pricing language={language} />;
      default:
        return <PDFConverter language={language} />;
    }
  };

  return (
    <Layout 
      activeTool={activeTool} 
      onToolChange={setActiveTool} 
      theme={theme} 
      onToggleTheme={toggleTheme}
      language={language}
      onToggleLanguage={toggleLanguage}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;