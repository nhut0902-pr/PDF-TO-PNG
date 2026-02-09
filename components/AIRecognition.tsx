
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language, ToolType } from '../types';
import { LimitReachedModal } from './LimitReachedModal';

interface Props {
  language: Language;
  onNavigate?: (tool: ToolType) => void;
}

const getUsageKey = () => `supertool_usage_${new Date().toLocaleDateString('en-CA')}`;
const DEFAULT_LIMIT = 10;
const BONUS_LIMIT = 50;

export const AIRecognition: React.FC<Props> = ({ language, onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [maxLimit, setMaxLimit] = useState(DEFAULT_LIMIT);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    vi: {
      title: 'AI VISION',
      subtitle: 'Nhận diện đối tượng, vật thể và trích xuất văn bản từ hình ảnh bằng trí tuệ nhân tạo.',
      dropzoneTitle: 'Thả hình ảnh vào đây',
      dropzoneSubtitle: 'hoặc nhấn để chọn ảnh',
      processing: 'ĐANG PHÂN TÍCH...',
      btnProcess: 'BẮT ĐẦU NHẬN DIỆN',
      resultTitle: 'KẾT QUẢ PHÂN TÍCH',
      errorFile: 'Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP).',
      errorAI: 'Không thể kết nối với AI. Vui lòng thử lại sau.',
      usageCount: 'Hôm nay: {n}/{max}',
      copyBtn: 'Sao chép kết quả',
      copied: 'Đã sao chép!',
      newScan: 'Quét ảnh mới',
      prompt: 'Mô tả hình ảnh này một cách chi tiết. Nhận diện các đối tượng, vật thể, địa danh và trích xuất toàn bộ văn bản có trong ảnh nếu có. Trả về kết quả bằng tiếng Việt, trình bày đẹp bằng Markdown.'
    },
    en: {
      title: 'AI VISION',
      subtitle: 'Identify objects, scenes, and extract text from images using advanced AI.',
      dropzoneTitle: 'Drop image here',
      dropzoneSubtitle: 'or click to browse',
      processing: 'ANALYZING...',
      btnProcess: 'START RECOGNITION',
      resultTitle: 'ANALYSIS RESULT',
      errorFile: 'Please select a valid image file (PNG, JPG, WebP).',
      errorAI: 'Could not connect to AI. Please try again later.',
      usageCount: 'Today: {n}/{max}',
      copyBtn: 'Copy result',
      copied: 'Copied!',
      newScan: 'New Scan',
      prompt: 'Describe this image in detail. Identify objects, landmarks, and extract all text from the image if present. Return the results in English, well-formatted using Markdown.'
    }
  }[language];

  useEffect(() => {
    refreshLimitStatus();
  }, []);

  const refreshLimitStatus = () => {
    const current = parseInt(localStorage.getItem(getUsageKey()) || '0', 10);
    setUsageCount(current);
    const isRedeemed = localStorage.getItem('supertool_promo_redeemed');
    setMaxLimit(isRedeemed ? BONUS_LIMIT : DEFAULT_LIMIT);
  };

  const incrementLimit = () => {
    const current = parseInt(localStorage.getItem(getUsageKey()) || '0', 10);
    const newVal = current + 1;
    localStorage.setItem(getUsageKey(), newVal.toString());
    setUsageCount(newVal);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(t.errorFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult('');
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyzeImage = async () => {
    if (!image) return;

    // Check limit
    if (usageCount >= maxLimit) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: t.prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      });

      setResult(response.text || 'No description generated.');
      incrementLimit();
    } catch (error) {
      console.error('AI Error:', error);
      alert(t.errorAI);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const originalText = btn.innerText;
      btn.innerText = t.copied;
      setTimeout(() => btn.innerText = originalText, 2000);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 pb-20 animate-fade-in transition-colors">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase italic">
            AI <span className="text-violet-600">VISION</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            {!image ? (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group h-[450px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                  isDragging ? 'bg-violet-50 dark:bg-violet-900/10 border-violet-400 scale-[0.99]' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800'
                }`}
              >
                <input type="file" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} ref={fileInputRef} className="hidden" />
                <div className="relative mb-6">
                   <div className="absolute inset-0 bg-violet-100 dark:bg-violet-900/30 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform"></div>
                   <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 text-violet-600 dark:text-violet-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                   </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.dropzoneTitle}</h3>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">{t.dropzoneSubtitle}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-4 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                  <img src={image} alt="Upload" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => { setImage(null); setResult(''); }}
                      className="bg-white text-slate-900 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      {t.newScan}
                    </button>
                  </div>
                </div>
                {!result && !loading && (
                   <button 
                    onClick={analyzeImage}
                    className="w-full mt-6 py-5 bg-violet-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-none hover:bg-violet-700 transition-all transform hover:-translate-y-1"
                   >
                     {t.btnProcess}
                   </button>
                )}
                <div className="mt-4 flex justify-between items-center px-2">
                   <div className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${usageCount >= maxLimit ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400'}`}>
                      {t.usageCount.replace('{n}', usageCount.toString()).replace('{max}', maxLimit.toString())}
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
             <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 min-h-[450px] relative transition-colors">
                {!result && !loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <svg className="w-20 h-20 mb-6 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                    </svg>
                    <p className="font-black text-lg uppercase tracking-widest">{t.resultTitle}</p>
                  </div>
                ) : loading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                       <div className="w-16 h-16 border-4 border-violet-100 dark:border-violet-900 rounded-full"></div>
                       <div className="absolute inset-0 w-16 h-16 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest animate-pulse">{t.processing}</p>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50 dark:border-slate-800">
                       <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-xl">{t.resultTitle}</h3>
                       <button 
                        id="copy-btn"
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all"
                       >
                         {t.copyBtn}
                       </button>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                       {result.split('\n').map((line, i) => (
                         <p key={i} className="mb-4">{line}</p>
                       ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
      <LimitReachedModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)}
        onUpgrade={() => { setShowLimitModal(false); onNavigate?.(ToolType.PRICING); }}
        onRedeemSuccess={() => { setShowLimitModal(false); refreshLimitStatus(); }}
        language={language}
      />
    </>
  );
};
