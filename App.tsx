
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { PDFConverter } from './components/PDFConverter';
import { TikTokDownloader } from './components/TikTokDownloader';
import { RewardCenter } from './components/RewardCenter';
import { Pricing } from './components/Pricing';
import { Terms } from './components/Terms';
import { Privacy } from './components/Privacy';
import { PolicyBanner } from './components/PolicyBanner';
import { ToolType, Language, Theme } from './types';

const getUsageKey = () => `supertool_usage_${new Date().toLocaleDateString('en-CA')}`;
const DEFAULT_LIMIT = 10;
const BONUS_LIMIT = 50;

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

  // Global usage state
  const [usageCount, setUsageCount] = useState(0);
  const [maxLimit, setMaxLimit] = useState(DEFAULT_LIMIT);

  const refreshLimits = useCallback(() => {
    const current = parseInt(localStorage.getItem(getUsageKey()) || '0', 10);
    const isRedeemed = localStorage.getItem('supertool_promo_redeemed') === 'true';
    setUsageCount(current);
    setMaxLimit(isRedeemed ? BONUS_LIMIT : DEFAULT_LIMIT);
  }, []);

  useEffect(() => {
    refreshLimits();
  }, [refreshLimits, activeTool]);

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
    const commonProps = {
      language,
      usageCount,
      maxLimit,
      onRefreshLimits: refreshLimits
    };

    switch (activeTool) {
      case ToolType.PDF_TO_IMAGE:
        return <PDFConverter {...commonProps} onNavigate={setActiveTool} />;
      case ToolType.TIKTOK_DOWNLOADER:
        return <TikTokDownloader {...commonProps} onNavigate={setActiveTool} />;
      case ToolType.REWARD_CENTER:
        return <RewardCenter {...commonProps} />;
      case ToolType.PRICING:
        return <Pricing language={language} />;
      case ToolType.TERMS:
        return <Terms language={language} />;
      case ToolType.PRIVACY:
        return <Privacy language={language} />;
      default:
        return <PDFConverter {...commonProps} onNavigate={setActiveTool} />;
    }
  };

  return (
    <>
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
      <PolicyBanner language={language} onNavigate={setActiveTool} />
    </>
  );
};

export default App;
