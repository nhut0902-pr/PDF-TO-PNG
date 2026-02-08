
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PDFConverter } from './components/PDFConverter';
import { TikTokDownloader } from './components/TikTokDownloader';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.PDF_TO_IMAGE);

  return (
    <Layout activeTool={activeTool} onToolChange={setActiveTool}>
      {activeTool === ToolType.PDF_TO_IMAGE ? (
        <PDFConverter />
      ) : (
        <TikTokDownloader />
      )}
    </Layout>
  );
};

export default App;
