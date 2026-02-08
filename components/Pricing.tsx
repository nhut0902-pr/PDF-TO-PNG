
import React from 'react';
import { Language } from '../types';

interface Props {
  language: Language;
}

export const Pricing: React.FC<Props> = ({ language }) => {
  const t = {
    vi: {
      tag: 'Gói dịch vụ',
      title: 'Nâng tầm',
      highlight: 'trải nghiệm',
      subtitle: 'Chọn gói phù hợp với nhu cầu của bạn. Miễn phí mãi mãi cho các tính năng cơ bản.',
      bestSeller: 'Phổ biến nhất',
      upcomingLabel: 'Sắp tới',
      startBtn: 'Bắt đầu ngay',
      upcomingBtn: 'Sắp ra mắt',
      featuresTitle: 'Sắp ra mắt trong năm nay 🚀',
      others: '+12 tính năng khác...',
      free: {
        name: 'FREE',
        desc: 'Dành cho nhu cầu cơ bản hàng ngày.',
        features: [
          'Chuyển PDF sang Ảnh (1x)',
          'Tải TikTok không logo',
          'Lịch sử tải xuống (20 mục)',
          'Xử lý 10 file/ngày',
          'Hỗ trợ qua Email'
        ]
      },
      pro: {
        name: 'PRO',
        desc: 'Dành cho người dùng chuyên nghiệp.',
        features: [
          'Tất cả tính năng bản FREE',
          'Chất lượng ảnh 2x & 3x (Siêu nét)',
          'Không giới hạn số lượng file',
          'Tốc độ xử lý ưu tiên',
          '20+ tính năng sắp tới'
        ]
      },
      ultra: {
        name: 'ULTRA',
        desc: 'Gói tiết kiệm & quyền lợi tối đa.',
        features: [
          'Tất cả tính năng bản PRO',
          'Xử lý hàng loạt (Batch)',
          'Quyền truy cập API',
          'Hỗ trợ 24/7 Priority',
          '20+ tính năng sắp tới'
        ]
      }
    },
    en: {
      tag: 'Pricing Plans',
      title: 'Elevate your',
      highlight: 'experience',
      subtitle: 'Choose the plan that fits your needs. Forever free for basic features.',
      bestSeller: 'Best Seller',
      upcomingLabel: 'Coming Soon',
      startBtn: 'Get Started',
      upcomingBtn: 'Coming Soon',
      featuresTitle: 'Coming later this year 🚀',
      others: '+12 more features...',
      free: {
        name: 'FREE',
        desc: 'For your daily basic needs.',
        features: [
          'PDF to Image (1x)',
          'TikTok Downloader',
          'Download History (20 items)',
          '10 files / day',
          'Email Support'
        ]
      },
      pro: {
        name: 'PRO',
        desc: 'For power users and creators.',
        features: [
          'All FREE features',
          '2x & 3x Image Quality',
          'Unlimited files',
          'Priority processing',
          '20+ upcoming features'
        ]
      },
      ultra: {
        name: 'ULTRA',
        desc: 'Best value & maximum benefits.',
        features: [
          'All PRO features',
          'Batch processing',
          'API Access',
          '24/7 Priority Support',
          '20+ upcoming features'
        ]
      }
    }
  }[language];

  const plans = [
    {
      ...t.free,
      price: '0đ',
      // Fix: Add period property to ensure all items in the array have a consistent type
      period: '',
      button: t.startBtn,
      highlight: false,
      status: 'active'
    },
    {
      ...t.pro,
      price: language === 'vi' ? '99k' : '$5',
      period: language === 'vi' ? '/tháng' : '/mo',
      button: t.upcomingBtn,
      highlight: true,
      status: 'upcoming'
    },
    {
      ...t.ultra,
      price: language === 'vi' ? '299k' : '$15',
      period: language === 'vi' ? '/năm' : '/yr',
      button: t.upcomingBtn,
      highlight: false,
      status: 'upcoming'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in transition-colors">
      <div className="text-center mb-16">
        <h2 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4">{t.tag}</h2>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase italic">
          {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t.highlight}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-lg">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {plans.map((plan, idx) => (
          <div 
            key={idx}
            className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] ${
              plan.highlight 
                ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-2xl shadow-blue-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800'
            } ${plan.status === 'upcoming' ? 'opacity-90' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl z-10">
                {t.bestSeller}
              </div>
            )}

            {plan.status === 'upcoming' && (
              <div className="absolute top-6 right-6">
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200 dark:border-amber-900/50 italic">
                  {t.upcomingLabel}
                </span>
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${plan.highlight ? 'text-blue-400' : 'text-slate-400'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-black tracking-tighter uppercase italic">{plan.price}</span>
                {plan.period && <span className={`ml-1 text-sm font-bold ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>}
              </div>
              <p className={`mt-4 text-sm font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                {plan.desc}
              </p>
            </div>

            <div className="flex-grow space-y-5 mb-10">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start">
                  <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}`}>
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`ml-3 text-sm font-bold tracking-tight ${feature.includes('20+') ? (plan.highlight ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400') : (plan.highlight ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300')}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled={plan.status === 'upcoming'}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                plan.status === 'upcoming'
                  ? 'bg-slate-800 dark:bg-slate-700 text-slate-500 cursor-not-allowed italic'
                  : plan.highlight
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200'
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center max-w-4xl mx-auto shadow-sm transition-colors">
        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase italic">{t.featuresTitle}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Tách nhạc AI', 'Nén PDF', 'Gộp PDF', 'Edit Video', 'Tạo GIF', 'Scan OCR', 'Web Capture', 'Translate'].map((item) => (
            <div key={item} className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
              {item}
            </div>
          ))}
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-100 dark:border-blue-900/30 col-span-2 md:col-span-1">
            {t.others}
          </div>
        </div>
      </div>
    </div>
  );
};
