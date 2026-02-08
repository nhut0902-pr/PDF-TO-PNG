import React from 'react';
import { Language } from '../types';

interface Props {
  language: Language;
}

export const Terms: React.FC<Props> = ({ language }) => {
  const content = {
    vi: {
      title: 'Điều khoản sử dụng',
      lastUpdated: 'Cập nhật lần cuối: 08/02/2026',
      sections: [
        {
          h: '1. Chấp nhận điều khoản',
          p: 'Bằng cách sử dụng SuperTool, bạn đồng ý tuân thủ các điều khoản này. Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ ngay lập tức.'
        },
        {
          h: '2. Quyền sở hữu trí tuệ',
          p: 'Mọi nội dung tải xuống từ TikTok thuộc quyền sở hữu của tác giả gốc. SuperTool chỉ cung cấp công cụ hỗ trợ kỹ thuật và không chịu trách nhiệm về cách bạn sử dụng nội dung đó.'
        },
        {
          h: '3. Giới hạn sử dụng',
          p: 'Bạn không được phép sử dụng dịch vụ cho các mục đích vi phạm pháp luật, phát tán mã độc hoặc gây hại đến hệ thống của chúng tôi.'
        },
        {
          h: '4. Từ chối trách nhiệm',
          p: 'Dịch vụ được cung cấp "nguyên trạng". Chúng tôi không đảm bảo tính ổn định tuyệt đối và không chịu trách nhiệm cho bất kỳ mất mát dữ liệu nào phát sinh.'
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: February 08, 2026',
      sections: [
        {
          h: '1. Acceptance of Terms',
          p: 'By using SuperTool, you agree to comply with these terms. If you do not agree, please stop using the service immediately.'
        },
        {
          h: '2. Intellectual Property',
          p: 'All content downloaded from TikTok belongs to the original creator. SuperTool only provides technical tools and is not responsible for how you use that content.'
        },
        {
          h: '3. Usage Restrictions',
          p: 'You may not use the service for illegal purposes, distribute malware, or harm our systems.'
        },
        {
          h: '4. Disclaimer',
          p: 'The service is provided "as is". We do not guarantee absolute stability and are not responsible for any data loss that occurs.'
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