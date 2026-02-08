import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PDFConverter } from './components/PDFConverter';
import { TikTokDownloader } from './components/TikTokDownloader';
import { Pricing } from './components/Pricing';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.PDF_TO_IMAGE);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.PDF_TO_IMAGE:
        return <PDFConverter />;
      case ToolType.TIKTOK_DOWNLOADER:
        return <TikTokDownloader />;
      case ToolType.PRICING:
        return <Pricing />;
      default:
        return <PDFConverter />;
    }
  };

  return (
    <Layout activeTool={activeTool} onToolChange={setActiveTool}>
      {renderContent()}
    </Layout>
  );
};

export default App;