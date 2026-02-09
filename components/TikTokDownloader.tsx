
import React, { useState, useEffect } from 'react';
import { TikTokData, HistoryItem, Language, ToolType } from '../types';
import { LimitReachedModal } from './LimitReachedModal';

const STORAGE_KEY = 'tiktok_download_history';
const getUsageKey = () => `supertool_usage_${new Date().toLocaleDateString('en-CA')}`;

interface Props {
  language: Language;
  usageCount: number;
  maxLimit: number;
  onRefreshLimits: () => void;
  onNavigate?: (tool: ToolType) => void;
}

export const TikTokDownloader: React.FC<Props> = ({ language, usageCount, maxLimit, onRefreshLimits, onNavigate }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TikTokData['data'] | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const t = {
    vi: {
      title: 'TikTok Downloader',
      subtitle: 'Tải Video & Ảnh Slideshow không logo',
      placeholder: 'Dán link TikTok tại đây...',
      btnProcess: 'XỬ LÝ NGAY',
      btnScanning: 'ĐANG QUÉT...',
      errorNotFound: 'Không tìm thấy nội dung. Vui lòng kiểm tra lại đường dẫn.',
      errorGeneral: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
      historyTitle: 'Lịch sử tải xuống',
      historyEmpty: 'Chưa có lịch sử',
      historyClear: 'Xóa hết',
      historyConfirm: 'Bạn có chắc muốn xóa toàn bộ lịch sử?',
      readyToDownload: 'Sẵn sàng tải xuống',
      successTitle: 'Mọi thứ đã sẵn sàng!',
      successSubtitle: 'Chọn định dạng bạn muốn lưu lại dưới đây.',
      downloadAllImages: 'TẢI TOÀN BỘ {n} ẢNH',
      btnVideoNoLogo: 'VIDEO KHÔNG LOGO',
      btnMusic: 'LƯU NHẠC (MP3)',
      btnOriginal: 'Video gốc có Logo',
      disclaimer: 'Nội dung không được lưu trữ trên hệ thống của chúng tôi.',
      timeJustNow: 'Vừa xong',
      timeMinutes: '{n} phút trước',
      timeHours: '{n} giờ trước',
      usageCount: 'Hôm nay: {n}/{max}'
    },
    en: {
      title: 'TikTok Downloader',
      subtitle: 'Download Video & Slideshow without watermark',
      placeholder: 'Paste TikTok link here...',
      btnProcess: 'PROCESS NOW',
      btnScanning: 'SCANNING...',
      errorNotFound: 'Content not found. Please check your link.',
      errorGeneral: 'An error occurred. Please try again later.',
      historyTitle: 'Download History',
      historyEmpty: 'No history yet',
      historyClear: 'Clear all',
      historyConfirm: 'Are you sure you want to clear all history?',
      readyToDownload: 'Ready to download',
      successTitle: 'Everything is ready!',
      successSubtitle: 'Choose the format you want to save below.',
      downloadAllImages: 'DOWNLOAD ALL {n} IMAGES',
      btnVideoNoLogo: 'VIDEO NO LOGO',
      btnMusic: 'SAVE MUSIC (MP3)',
      btnOriginal: 'Original Video with Logo',
      disclaimer: 'Content is not stored on our systems.',
      timeJustNow: 'Just now',
      timeMinutes: '{n} minutes ago',
      timeHours: '{n} hours ago',
      usageCount: 'Today: {n}/{max}'
    }
  }[language];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const incrementLimit = () => {
    const current = parseInt(localStorage.getItem(getUsageKey()) || '0', 10);
    const newVal = current + 1;
    localStorage.setItem(getUsageKey(), newVal.toString());
    onRefreshLimits();
  };

  const saveToHistory = (tiktokData: TikTokData['data'], originalUrl: string) => {
    const newItem: HistoryItem = {
      id: tiktokData.id,
      title: tiktokData.title || (language === 'vi' ? 'Không có tiêu đề' : 'Untitled'),
      cover: tiktokData.cover,
      authorNickname: tiktokData.author.nickname,
      authorAvatar: tiktokData.author.avatar,
      timestamp: Date.now(),
      type: tiktokData.images ? 'slideshow' : 'video',
      originalUrl: originalUrl
    };

    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== newItem.id);
      const updated = [newItem, ...filtered].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDownload = async (targetUrl: string = url) => {
    if (!targetUrl) return;

    if (usageCount >= maxLimit) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}`);
      const result: TikTokData = await response.json();

      if (result.code === 0) {
        setData(result.data);
        saveToHistory(result.data, targetUrl);
        incrementLimit(); 
      } else {
        setError(result.msg || t.errorNotFound);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = localUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(localUrl);
    } catch (e) {
      window.open(fileUrl, '_blank');
    }
  };

  const removeFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllHistory = () => {
    if (confirm(t.historyConfirm)) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t.timeJustNow;
    if (mins < 60) return t.timeMinutes.replace('{n}', mins.toString());
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t.timeHours.replace('{n}', hours.toString());
    return new Date(ts).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 md:p-12 transition-colors relative">
               <div className={`absolute top-6 right-8 text-[10px] font-bold px-2 py-1 rounded-lg ${usageCount >= maxLimit ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                  {t.usageCount.replace('{n}', usageCount.toString()).replace('{max}', maxLimit.toString())}
               </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center tracking-tight uppercase italic">{t.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 text-center text-lg font-medium">{t.subtitle}</p>
              
              <div className="flex flex-col space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full px-6 py-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-3xl focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-8 focus:ring-blue-50 dark:focus:ring-blue-900/10 transition-all outline-none pr-14 text-lg font-medium text-slate-900 dark:text-white"
                  />
                  {url && (
                    <button onClick={() => setUrl('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => handleDownload()}
                  disabled={loading || !url}
                  className={`w-full py-6 rounded-3xl text-white font-black text-xl shadow-2xl transition-all transform active:scale-[0.97] flex items-center justify-center space-x-3 ${
                    loading || !url ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none text-slate-400' : 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-indigo-600'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      <span>{t.btnScanning}</span>
                    </div>
                  ) : (
                    <span>{t.btnProcess}</span>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-8 p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-center font-bold animate-shake text-sm uppercase tracking-tight">
                  {error}
                </div>
              )}
            </div>

            {data && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-slide-up transition-colors">
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="relative">
                      <img src={data.author.avatar} alt={data.author.nickname} className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-700 shadow-md" />
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white dark:border-slate-700">
                         <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-xl tracking-tight">@{data.author.nickname}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs md:max-w-md line-clamp-1 font-medium italic">{data.title}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/5 flex-shrink-0">
                      <div className="rounded-3xl overflow-hidden bg-slate-900 aspect-[9/16] relative shadow-2xl group border-8 border-slate-900 dark:border-slate-800">
                        {data.images && data.images.length > 0 ? (
                          <div className="h-full overflow-y-auto no-scrollbar scroll-smooth p-2 bg-slate-800 transition-colors">
                            {data.images.map((img, idx) => (
                              <div key={idx} className="relative mb-2 last:mb-0 group/img rounded-xl overflow-hidden">
                                 <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-auto" />
                                 <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">#{idx+1}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <video src={data.play} controls poster={data.cover} className="w-full h-full object-contain" />
                        )}
                      </div>
                    </div>

                    <div className="lg:w-3/5 flex flex-col justify-start space-y-8">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-emerald-500 font-black text-xs uppercase tracking-widest italic">
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{t.readyToDownload}</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">{t.successTitle}</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t.successSubtitle}</p>
                      </div>
                      
                      {data.images && data.images.length > 0 ? (
                        <div className="space-y-6">
                          <button
                            onClick={() => data.images?.forEach((img, idx) => setTimeout(() => saveFile(img, `tk-img-${idx+1}.jpeg`), idx*300))}
                            className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center space-x-3 transform hover:-translate-y-1"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            <span>{t.downloadAllImages.replace('{n}', data.images.length.toString())}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <button
                            onClick={() => saveFile(data.play, `tk-no-wm-${data.id}.mp4`)}
                            className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-3xl font-black text-xl hover:bg-black dark:hover:bg-blue-700 transition-all shadow-2xl flex items-center justify-center space-x-3 transform hover:-translate-y-1"
                          >
                            <span>{t.btnVideoNoLogo}</span>
                          </button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={() => saveFile(data.music, `tk-audio-${data.id}.mp3`)}
                              className="py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-black hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center space-x-2"
                            >
                               <span className="uppercase text-xs tracking-widest">{t.btnMusic}</span>
                            </button>
                            <button
                              onClick={() => saveFile(data.wmplay, `tk-wm-${data.id}.mp4`)}
                              className="py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-2xl font-bold hover:border-slate-200 dark:hover:border-slate-600 transition-all flex items-center justify-center space-x-2"
                            >
                              <span className="text-[10px] uppercase tracking-widest">{t.btnOriginal}</span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">
                        <span>{t.disclaimer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm sticky top-24 transition-colors">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-sm">{t.historyTitle}</h3>
                {history.length > 0 && (
                  <button onClick={clearAllHistory} className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest">{t.historyClear}</button>
                )}
              </div>
              
              <div className="p-2 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                {history.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-xs font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest px-4">{t.historyEmpty}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {history.map((item) => (
                      <div 
                        key={item.id + item.timestamp}
                        onClick={() => handleDownload(item.originalUrl)}
                        className="group flex items-center p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                      >
                        <div className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800 relative">
                          <img src={item.cover} alt="" className="w-full h-full object-cover" />
                          {item.type === 'slideshow' && (
                            <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm rounded-md p-0.5">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-grow min-w-0">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">@{item.authorNickname}</h4>
                          <p className="text-[10px] text-slate-400 truncate font-medium">{item.title}</p>
                          <p className="text-[9px] text-slate-300 dark:text-slate-600 font-bold uppercase mt-1">{formatTime(item.timestamp)}</p>
                        </div>
                        <button 
                          onClick={(e) => removeFromHistory(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LimitReachedModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)}
        onUpgrade={() => { setShowLimitModal(false); onNavigate?.(ToolType.PRICING); }}
        onRedeemSuccess={() => { setShowLimitModal(false); onRefreshLimits(); }}
        language={language}
      />
    </>
  );
};
