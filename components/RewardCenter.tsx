
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface Props {
  language: Language;
  usageCount: number;
  maxLimit: number;
  onRefreshLimits: () => void;
}

const PERMANENT_CODES = [
  'SUPERTOOL_01', 'NHUTCODER_02', 'REWARD_03', 'BONUS_04', 'GIFT_05',
  'PRO_06', 'VIP_07', 'CODE_08', 'NHUT_09', '090211'
];

const TRIAL_CODES = [
  'TRIAL24_01', 'TRIAL24_02', 'TRIAL24_03', 'TRIAL24_04', 'TRIAL24_05',
  'TRIAL24_06', 'TRIAL24_07', 'TRIAL24_08', 'TRIAL24_09', 'TRIAL24_10'
];

export const RewardCenter: React.FC<Props> = ({ language, usageCount, maxLimit, onRefreshLimits }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const BONUS_LIMIT = 50;
  const isBonusActive = maxLimit === BONUS_LIMIT;

  useEffect(() => {
    const updateCountdown = () => {
      const expires = parseInt(localStorage.getItem('supertool_trial_expires') || '0', 10);
      const isPermanent = localStorage.getItem('supertool_promo_redeemed') === 'true';
      
      if (isPermanent) {
        setTimeLeft(null);
        return;
      }

      const diff = expires - Date.now();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}p`);
      } else {
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [maxLimit]);

  const t = {
    vi: {
      title: 'TRUNG TÂM PHẦN THƯỞNG',
      subtitle: 'Nâng cấp giới hạn sử dụng để trải nghiệm công cụ mượt mà hơn.',
      usageStatus: 'TRẠNG THÁI HIỆN TẠI',
      used: 'Đã dùng',
      limit: 'Giới hạn',
      inputLabel: 'KÍCH HOẠT MÃ QUÀ TẶNG / DÙNG THỬ',
      placeholder: 'Nhập mã của bạn...',
      btnSubmit: 'XÁC NHẬN KÍCH HOẠT',
      errorInvalid: 'Mã không chính xác hoặc đã hết hạn.',
      errorUsed: 'Bạn đã kích hoạt gói này rồi!',
      successMsg: 'Kích hoạt thành công! Giới hạn đã tăng lên 50 lượt.',
      trialSuccessMsg: 'Kích hoạt dùng thử 24h thành công! Giới hạn tăng lên 50 lượt.',
      guideTitle: 'LÀM SAO ĐỂ CÓ MÃ?',
      guideStep1: '1. Theo dõi TikTok của mình tại @nhutcoder0902',
      guideStep2: '2. Nhắn tin hoặc xem các video mới nhất để nhận code.',
      guideStep3: '3. Mã code thường được làm mới mỗi tuần.',
      btnTikTok: 'TRUY CẬP TIKTOK',
      statusFree: 'Gói FREE (10 lượt)',
      statusBonus: 'Gói PRO (50 lượt)',
      activeBadge: 'ĐÃ KÍCH HOẠT',
      activeDesc: 'Chúc mừng! Bạn đang sử dụng giới hạn 50 lượt/ngày.',
      trialTime: 'Thời hạn dùng thử còn: ',
      safeInfo: 'Hệ thống tự động ghi nhớ trạng thái trên trình duyệt này.'
    },
    en: {
      title: 'REWARD CENTER',
      subtitle: 'Upgrade your usage limits for a better experience.',
      usageStatus: 'CURRENT STATUS',
      used: 'Used',
      limit: 'Limit',
      inputLabel: 'ACTIVATE GIFT / TRIAL CODE',
      placeholder: 'Enter your code...',
      btnSubmit: 'CONFIRM ACTIVATION',
      errorInvalid: 'Invalid or expired code.',
      errorUsed: 'Plan already active!',
      successMsg: 'Success! Your limit increased to 50 uses.',
      trialSuccessMsg: '24h Trial activated! Limit increased to 50 uses.',
      guideTitle: 'HOW TO GET CODES?',
      guideStep1: '1. Follow my TikTok @nhutcoder0902',
      guideStep2: '2. Message me or check latest videos for codes.',
      guideStep3: '3. Codes are usually refreshed weekly.',
      btnTikTok: 'VISIT TIKTOK',
      statusFree: 'FREE Plan (10 uses)',
      statusBonus: 'PRO Plan (50 uses)',
      activeBadge: 'ACTIVATED',
      activeDesc: 'Congrats! You are using 50 uses/day limit.',
      trialTime: 'Trial expires in: ',
      safeInfo: 'System automatically remembers status on this browser.'
    }
  }[language];

  const handleRedeem = () => {
    setError('');
    setSuccess('');

    const inputCode = code.trim().toUpperCase();
    if (!inputCode) return;

    if (PERMANENT_CODES.includes(inputCode)) {
      if (localStorage.getItem('supertool_promo_redeemed') === 'true') {
        setError(t.errorUsed);
        return;
      }
      localStorage.setItem('supertool_promo_redeemed', 'true');
      setSuccess(t.successMsg);
      setCode('');
      onRefreshLimits();
    } else if (TRIAL_CODES.includes(inputCode)) {
      const trialExpires = parseInt(localStorage.getItem('supertool_trial_expires') || '0', 10);
      if (trialExpires > Date.now() || localStorage.getItem('supertool_promo_redeemed') === 'true') {
        setError(t.errorUsed);
        return;
      }
      localStorage.setItem('supertool_trial_expires', (Date.now() + 24 * 60 * 60 * 1000).toString());
      setSuccess(t.trialSuccessMsg);
      setCode('');
      onRefreshLimits();
    } else {
      setError(t.errorInvalid);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-6 text-amber-500 shadow-xl shadow-amber-100 dark:shadow-none animate-bounce">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 8H4a1 1 0 01-1-1v-1h3v1a1 1 0 01-1 1zm7-1h-3a1 1 0 01-1-1v-1h3v1a1 1 0 01-1 1z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase italic">
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className={`rounded-[2.5rem] p-8 shadow-xl border transition-all duration-500 ${
            isBonusActive 
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-transparent text-white scale-[1.02] ring-4 ring-amber-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
          }`}>
            <h3 className={`text-xs font-black uppercase tracking-widest mb-6 ${isBonusActive ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'}`}>
              {t.usageStatus}
            </h3>
            <div className="flex items-center justify-between mb-8">
               <div>
                  <div className="flex items-center space-x-2">
                    <p className={`text-4xl font-black ${isBonusActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {usageCount}
                      <span className={`text-lg ml-2 ${isBonusActive ? 'text-amber-200' : 'text-slate-300 dark:text-slate-700'}`}>/ {maxLimit}</span>
                    </p>
                    {isBonusActive && (
                      <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter animate-pulse border border-white/30">
                        {timeLeft ? 'TRIAL' : 'PRO+'}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-tighter mt-1 ${isBonusActive ? 'text-amber-100' : 'text-slate-400'}`}>
                    {isBonusActive ? t.statusBonus : t.statusFree}
                  </p>
               </div>
               <div className="h-16 w-16 relative">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className={isBonusActive ? 'text-amber-400/30' : 'text-slate-100 dark:text-slate-800'} />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                      strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * usageCount) / maxLimit}
                      className={`${isBonusActive ? 'text-white' : 'text-amber-500'} transition-all duration-1000 stroke-round`} />
                  </svg>
               </div>
            </div>
            {timeLeft && (
              <div className="mb-4 text-xs font-black uppercase tracking-widest text-amber-100 animate-pulse">
                {t.trialTime}{timeLeft}
              </div>
            )}
            <div className={`w-full rounded-2xl p-4 flex items-center space-x-3 ${isBonusActive ? 'bg-white/10 border border-white/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
               <div className={`p-2 rounded-lg ${isBonusActive ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
               </div>
               <p className={`text-[10px] font-black uppercase tracking-tight ${isBonusActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                 {isBonusActive ? t.activeBadge : 'Mã code sẽ được làm mới hàng tuần.'}
               </p>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <h3 className="text-xs font-black text-blue-300 uppercase tracking-widest mb-6">{t.guideTitle}</h3>
            <div className="space-y-4 mb-8">
              <p className="text-sm font-bold opacity-90">{t.guideStep1}</p>
              <p className="text-sm font-bold opacity-90">{t.guideStep2}</p>
              <p className="text-sm font-bold opacity-90">{t.guideStep3}</p>
            </div>
            <a 
              href="https://www.tiktok.com/@nhutcoder0902" 
              target="_blank" 
              rel="noreferrer"
              className="block w-full py-4 bg-white text-slate-900 rounded-2xl text-center font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform"
            >
              {t.btnTikTok}
            </a>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 transition-all flex-grow">
            {isBonusActive && !timeLeft ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-8 shadow-inner ring-8 ring-emerald-50 dark:ring-emerald-900/10">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2 mb-8">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{t.activeBadge}</h3>
                  <div className="inline-block px-4 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest">Gói PRO Vĩnh Viễn</div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mb-10">
                  {t.activeDesc}
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 w-full">
                   <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{t.safeInfo}</p>
                   <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">Status: Active (LocalStorage Managed)</p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">{t.inputLabel}</h3>
                <div className="space-y-6">
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-amber-500 transition-all outline-none text-xl font-black text-slate-900 dark:text-white uppercase"
                  />
                  <button 
                    onClick={handleRedeem}
                    className="w-full py-6 bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-100 dark:shadow-none hover:bg-amber-600 transition-all transform active:scale-[0.98]"
                  >
                    {t.btnSubmit}
                  </button>

                  {error && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 rounded-xl text-xs font-bold animate-shake text-center border border-rose-100 dark:border-rose-900/30">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold animate-bounce text-center border border-emerald-100 dark:border-emerald-900/30">
                      {success}
                    </div>
                  )}
                </div>

                {timeLeft && (
                  <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center">
                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] mb-2">Đang sử dụng gói dùng thử 24h</p>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400 italic">{timeLeft}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
