
import React, { useState } from 'react';
import { Language } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onRedeemSuccess: () => void;
  language: Language;
}

const PERMANENT_CODES = [
  'SUPERTOOL_01', 'NHUTCODER_02', 'REWARD_03', 'BONUS_04', 'GIFT_05',
  'PRO_06', 'VIP_07', 'CODE_08', 'NHUT_09', '090211'
];

const TRIAL_CODES = [
  'TRIAL24_01', 'TRIAL24_02', 'TRIAL24_03', 'TRIAL24_04', 'TRIAL24_05',
  'TRIAL24_06', 'TRIAL24_07', 'TRIAL24_08', 'TRIAL24_09', 'TRIAL24_10'
];

export const LimitReachedModal: React.FC<Props> = ({ isOpen, onClose, onUpgrade, onRedeemSuccess, language }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const t = {
    vi: {
      title: 'Hết lượt miễn phí hôm nay',
      message: 'Bạn đã đạt giới hạn 10 lượt xử lý file trong ngày. Nâng cấp PRO hoặc nhập mã quà tặng để tiếp tục.',
      upgrade: 'Nâng cấp ngay',
      cancel: 'Để sau',
      giftLabel: 'Nhập mã quà tặng / Dùng thử',
      giftPlaceholder: 'Nhập mã code...',
      submit: 'Áp dụng',
      contactHint: 'Muốn nhận mã vui lòng truy cập TikTok ib cho mình:',
      contactLink: 'nhutcoder0902',
      codeUsed: 'Bạn đã sử dụng mã này rồi!',
      codeInvalid: 'Mã không chính xác.',
      codeSuccess: 'Áp dụng thành công! Giới hạn đã được tăng.'
    },
    en: {
      title: 'Daily Limit Reached',
      message: 'You reached the 10-file daily limit. Upgrade to PRO or enter a gift code to continue.',
      upgrade: 'Upgrade Now',
      cancel: 'Later',
      giftLabel: 'Enter Gift / Trial Code',
      giftPlaceholder: 'Enter code...',
      submit: 'Apply',
      contactHint: 'To get a code, please contact me on TikTok:',
      contactLink: 'nhutcoder0902',
      codeUsed: 'You have already used this code!',
      codeInvalid: 'Invalid code.',
      codeSuccess: 'Success! Limit increased.'
    }
  }[language];

  const handleRedeem = () => {
    setError('');
    setSuccessMsg('');

    const inputCode = code.trim().toUpperCase();
    if (!inputCode) return;

    if (PERMANENT_CODES.includes(inputCode)) {
      if (localStorage.getItem('supertool_promo_redeemed') === 'true') {
        setError(t.codeUsed);
        return;
      }
      localStorage.setItem('supertool_promo_redeemed', 'true');
      setSuccessMsg(t.codeSuccess);
      setTimeout(() => {
        onRedeemSuccess();
        setCode('');
      }, 1500);
    } else if (TRIAL_CODES.includes(inputCode)) {
      const trialExpires = parseInt(localStorage.getItem('supertool_trial_expires') || '0', 10);
      if (trialExpires > Date.now() || localStorage.getItem('supertool_promo_redeemed') === 'true') {
        setError(t.codeUsed);
        return;
      }
      localStorage.setItem('supertool_trial_expires', (Date.now() + 24 * 60 * 60 * 1000).toString());
      setSuccessMsg(t.codeSuccess);
      setTimeout(() => {
        onRedeemSuccess();
        setCode('');
      }, 1500);
    } else {
      setError(t.codeInvalid);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up overflow-hidden text-center">
        
        <div className="mb-6">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-7 h-7 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed px-2">
            {t.message}
            </p>
        </div>

        <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                {t.giftLabel}
            </label>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t.giftPlaceholder}
                    className="flex-grow px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors uppercase"
                />
                <button 
                    onClick={handleRedeem}
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                    {t.submit}
                </button>
            </div>
            {error && <p className="mt-2 text-xs font-bold text-rose-500">{error}</p>}
            {successMsg && <p className="mt-2 text-xs font-bold text-emerald-500">{successMsg}</p>}
            
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {t.contactHint} <a href="https://www.tiktok.com/@nhutcoder0902" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">@{t.contactLink}</a>
                </p>
            </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button 
            onClick={onUpgrade}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:shadow-blue-500/30 transition-all transform hover:scale-[1.02]"
          >
            {t.upgrade}
          </button>
          <button 
            onClick={onClose}
            className="w-full py-3 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
