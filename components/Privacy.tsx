import React from 'react';
import { Language } from '../types';

interface Props {
  language: Language;
}

export const Privacy: React.FC<Props> = ({ language }) => {
  const content = {
    vi: {
      title: 'Chính sách bảo mật',
      lastUpdated: 'Cập nhật lần cuối: 08/02/2026',
      sections: [
        {
          h: '1. Dữ liệu của bạn',
          p: 'Chúng tôi KHÔNG lưu trữ tệp PDF hoặc video TikTok của bạn trên máy chủ. Mọi quá trình xử lý PDF diễn ra trực tiếp trên trình duyệt của bạn (Client-side).'
        },
        {
          h: '2. Cookies và Lưu trữ cục bộ',
          p: 'Chúng tôi sử dụng LocalStorage để lưu trữ lịch sử tải xuống và cài đặt cá nhân (giao diện sáng/tối, ngôn ngữ) của bạn. Dữ liệu này chỉ nằm trên máy tính của bạn.'
        },
        {
          h: '3. Bảo mật',
          p: 'Vì không có dữ liệu nhạy cảm nào được tải lên máy chủ, quyền riêng tư của bạn được bảo vệ tuyệt đối khi sử dụng các công cụ của chúng tôi.'
        },
        {
          h: '4. Liên kết bên thứ ba',
          p: 'Dịch vụ của chúng tôi có thể chứa các liên kết đến TikTok hoặc GitHub. Chúng tôi không chịu trách nhiệm về chính sách bảo mật của các trang web đó.'
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: February 08, 2026',
      sections: [
        {
          h: '1. Your Data',
          p: 'We do NOT store your PDF files or TikTok videos on our servers. All PDF processing happens directly in your browser (Client-side).'
        },
        {
          h: '2. Cookies and Local Storage',
          p: 'We use LocalStorage to store your download history and personal settings (light/dark mode, language). This data remains only on your device.'
        },
        {
          h: '3. Security',
          p: 'Since no sensitive data is uploaded to our servers, your privacy is fully protected when using our tools.'
        },
        {
          h: '4. Third-party Links',
          p: 'Our service may contain links to TikTok or GitHub. We are not responsible for the privacy policies of those websites.'
        }
      ]
    }
  }[language];

  return (
    <div className="max-w-4xl mx-auto py-10 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-100 dark:border-slate-800">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase italic tracking-tighter">{content.title}</h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-12">{content.lastUpdated}</p>
        
        <div className="space-y-10">
          {content.sections.map((s, i) => (
            <div key={i} className="space-y-3">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{s.h}</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};