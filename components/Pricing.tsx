import React from 'react';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'FREE',
      price: '0đ',
      desc: 'Dành cho nhu cầu cơ bản hàng ngày.',
      features: [
        'Chuyển PDF sang Ảnh (1x)',
        'Tải TikTok không logo',
        'Lịch sử tải xuống (20 mục)',
        'Xử lý 10 file/ngày',
        'Hỗ trợ qua Email'
      ],
      button: 'Bắt đầu ngay',
      highlight: false,
      status: 'active'
    },
    {
      name: 'PRO',
      price: '99k',
      period: '/tháng',
      desc: 'Dành cho người dùng chuyên nghiệp.',
      features: [
        'Tất cả tính năng bản FREE',
        'Chất lượng ảnh 2x & 3x (Siêu nét)',
        'Không giới hạn số lượng file',
        'Tốc độ xử lý ưu tiên',
        '20+ tính năng sắp tới'
      ],
      button: 'Sắp ra mắt',
      highlight: true,
      status: 'upcoming'
    },
    {
      name: 'ULTRA',
      price: '299k',
      period: '/năm',
      desc: 'Gói tiết kiệm & quyền lợi tối đa.',
      features: [
        'Tất cả tính năng bản PRO',
        'Xử lý hàng loạt (Batch)',
        'Quyền truy cập API',
        'Hỗ trợ 24/7 Priority',
        '20+ tính năng sắp tới'
      ],
      button: 'Sắp ra mắt',
      highlight: false,
      status: 'upcoming'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      <div className="text-center mb-16">
        <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Gói dịch vụ</h2>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
          Nâng tầm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">trải nghiệm</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg">
          Chọn gói phù hợp với nhu cầu của bạn. Miễn phí mãi mãi cho các tính năng cơ bản.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {plans.map((plan, idx) => (
          <div 
            key={idx}
            className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] ${
              plan.highlight 
                ? 'bg-slate-900 text-white shadow-2xl shadow-blue-200' 
                : 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100'
            } ${plan.status === 'upcoming' ? 'opacity-90' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl z-10">
                Phổ biến nhất
              </div>
            )}

            {plan.status === 'upcoming' && (
              <div className="absolute top-6 right-6">
                <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
                  Sắp tới
                </span>
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${plan.highlight ? 'text-blue-400' : 'text-slate-400'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                {plan.period && <span className={`ml-1 text-sm font-bold ${plan.highlight ? 'text-slate-400' : 'text-slate-400'}`}>{plan.period}</span>}
              </div>
              <p className={`mt-4 text-sm font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                {plan.desc}
              </p>
            </div>

            <div className="flex-grow space-y-5 mb-10">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start">
                  <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`ml-3 text-sm font-bold ${feature.includes('20+') ? (plan.highlight ? 'text-emerald-400' : 'text-emerald-600') : (plan.highlight ? 'text-slate-200' : 'text-slate-600')}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              disabled={plan.status === 'upcoming'}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                plan.status === 'upcoming'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : plan.highlight
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/40'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-white rounded-[3rem] border border-slate-100 text-center max-w-4xl mx-auto shadow-sm">
        <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">Sắp ra mắt trong năm nay 🚀</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Tách nhạc AI', 'Nén PDF', 'Gộp PDF', 'Edit Video', 'Tạo GIF', 'Scan OCR', 'Web Capture', 'Translate'].map((item) => (
            <div key={item} className="px-4 py-3 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
              {item}
            </div>
          ))}
          <div className="px-4 py-3 bg-blue-50 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 col-span-2 md:col-span-1">
            +12 tính năng khác...
          </div>
        </div>
      </div>
    </div>
  );
};