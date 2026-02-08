import React, { useState, useEffect } from 'react';
import { Language, ToolType } from '../types';

interface Props {
  language: Language;
  onNavigate: (tool: ToolType) => void;
}

export const PolicyBanner: React.FC<Props> = ({ language, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('user_consent_2026');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('user_consent_2026', 'true');
    setIsVisible(false);
  };

  const t = {
    vi: {
      message: 'Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn. Bằng cách tiếp tục sử dụng, bạn đồng ý với ',
      terms: 'Điều khoản sử dụng',
      and: ' và ',
      privacy: 'Chính sách bảo mật',
      btn: 'Đã hiểu'
    },
    en: {
      message: 'We use cookies and similar technologies to enhance your experience. By continuing, you agree to our ',
      terms: 'Terms of Service',
      and: ' and ',
      privacy: 'Privacy Policy',
      btn: 'Got it'
    }
  }[language];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-2xl animate-slide-up">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-[2rem] p-6 md:px-8 md:py-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-grow text-center md:text-left">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.message}
            <button 
              onClick={() => onNavigate(ToolType.TERMS)} 
              className="text-blue-600 dark:text-blue-400 hover:underline decoration-2 underline-offset-4"
            >
              {t.terms}
            </button>
            {t.and}
            <button 
              onClick={() => onNavigate(ToolType.PRIVACY)} 
              className="text-blue-600 dark:text-blue-400 hover:underline decoration-2 underline-offset-4"
            >
              {t.privacy}
            </button>.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-slate-200 dark:shadow-none whitespace-nowrap"
        >
          {t.btn}
        </button>
      </div>
    </div>
  );
};