import React, { useState, useEffect } from 'react';
import { TikTokData, HistoryItem } from '../types';

const STORAGE_KEY = 'tiktok_download_history';

export const TikTokDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TikTokData['data'] | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
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

  const saveToHistory = (tiktokData: TikTokData['data'], originalUrl: string) => {
    const newItem: HistoryItem = {
      id: tiktokData.id,
      title: tiktokData.title || 'Không có tiêu đề',
      cover: tiktokData.cover,
      authorNickname: tiktokData.author.nickname,
      authorAvatar: tiktokData.author.avatar,
      timestamp: Date.now(),
      type: tiktokData.images ? 'slideshow' : 'video',
      originalUrl: originalUrl
    };

    setHistory(prev => {
      // Remove existing if same ID to avoid duplicates, then add to top
      const filtered = prev.filter(item => item.id !== newItem.id);
      const updated = [newItem, ...filtered].slice(0, 20); // Keep last 20
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDownload = async (targetUrl: string = url) => {
    if (!targetUrl) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}`);
      const result: TikTokData = await response.json();

      if (result.code === 0) {
        setData(result.data);
        saveToHistory(result.data, targetUrl);
      } else {
        setError(result.msg || 'Không tìm thấy nội dung. Vui lòng kiểm tra lại đường dẫn.');
      }
    } catch (err) {
      console.error(err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
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

  const downloadAllImages = () => {
    if (data?.images) {
      data.images.forEach((img, idx) => {
        setTimeout(() => {
          saveFile(img, `tiktok-image-${data.id}-${idx + 1}.jpeg`);
        }, idx * 300);
      });
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
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return new Date(ts).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className="text-3xl font-black text-gray-900 mb-2 text-center tracking-tight uppercase">TikTok Downloader</h2>
            <p className="text-gray-500 mb-10 text-center text-lg">Tải Video & Ảnh Slideshow không logo</p>
            
            <div className="flex flex-col space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Dán link TikTok tại đây..."
                  className="w-full px-6 py-6 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-50 transition-all outline-none pr-14 text-lg font-medium"
                />
                {url && (
                  <button 
                    onClick={() => setUrl('')}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <button
                onClick={() => handleDownload()}
                disabled={loading || !url}
                className={`w-full py-6 rounded-3xl text-white font-black text-xl shadow-2xl transition-all transform active:scale-[0.97] flex items-center justify-center space-x-3 ${
                  loading || !url ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:shadow-slate-200'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>ĐANG QUÉT...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-3.3 2.97-5.92 6.25-6.04.53-.03 1.07.03 1.6.14v4.35c-.44-.1-.91-.12-1.36-.08-1.45.13-2.73 1.2-3.08 2.6-.17.65-.18 1.34-.03 2 .25 1.19 1.1 2.21 2.23 2.65.68.28 1.43.34 2.15.22 1.25-.19 2.3-.98 2.82-2.12.28-.58.42-1.22.41-1.87-.01-4.57.01-9.14-.02-13.71z"/>
                    </svg>
                    <span>XỬ LÝ NGAY</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-center font-bold animate-shake text-sm uppercase tracking-tight">
                {error}
              </div>
            )}
          </div>

          {data && (
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
              <div className="p-8 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <img src={data.author.avatar} alt={data.author.nickname} className="w-16 h-16 rounded-full border-4 border-white shadow-md" />
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                       <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-xl tracking-tight">@{data.author.nickname}</h4>
                    <p className="text-sm text-gray-500 max-w-xs md:max-w-md line-clamp-1 font-medium">{data.title}</p>
                  </div>
                </div>
                <div className={`hidden md:block px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${data.images ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-pink-50 border-pink-100 text-pink-600'}`}>
                  {data.images ? 'SLIDESHOW' : 'VIDEO'}
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-2/5 flex-shrink-0">
                    <div className="rounded-3xl overflow-hidden bg-slate-900 aspect-[9/16] relative shadow-2xl group border-8 border-slate-900">
                      {data.images && data.images.length > 0 ? (
                        <div className="h-full overflow-y-auto no-scrollbar scroll-smooth p-2 bg-slate-800">
                          {data.images.map((img, idx) => (
                            <div key={idx} className="relative mb-2 last:mb-0 group/img rounded-xl overflow-hidden">
                               <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-auto" />
                               <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">#{idx+1}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <video
                          src={data.play}
                          controls
                          poster={data.cover}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div className="lg:w-3/5 flex flex-col justify-start space-y-8">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Sẵn sàng tải xuống</span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 leading-tight">Mọi thứ đã sẵn sàng!</h3>
                      <p className="text-gray-500 font-medium">Chọn định dạng bạn muốn lưu lại dưới đây.</p>
                    </div>
                    
                    {data.images && data.images.length > 0 ? (
                      <div className="space-y-6">
                        <button
                          onClick={downloadAllImages}
                          className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 transform hover:-translate-y-1"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>TẢI TOÀN BỘ {data.images.length} ẢNH</span>
                        </button>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {data.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => saveFile(img, `tiktok-img-${idx + 1}.jpeg`)}
                              className="py-4 px-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl text-xs font-black hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-between group/item"
                            >
                              <span>ẢNH {idx + 1}</span>
                              <svg className="w-5 h-5 text-slate-300 group-hover/item:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <button
                          onClick={() => saveFile(data.play, `tiktok-no-wm-${data.id}.mp4`)}
                          className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-black transition-all shadow-2xl flex items-center justify-center space-x-3 transform hover:-translate-y-1"
                        >
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>VIDEO KHÔNG LOGO</span>
                        </button>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            onClick={() => saveFile(data.music, `tiktok-audio-${data.id}.mp3`)}
                            className="py-5 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black hover:border-slate-300 transition-all flex items-center justify-center space-x-2"
                          >
                            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <span>LƯU NHẠC (MP3)</span>
                          </button>
                          <button
                            onClick={() => saveFile(data.wmplay, `tiktok-with-wm-${data.id}.mp4`)}
                            className="py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-bold hover:border-slate-200 hover:text-slate-600 transition-all flex items-center justify-center space-x-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <span className="text-xs uppercase tracking-widest">Video gốc có Logo</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-8 border-t border-slate-100 flex items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <svg className="w-4 h-4 mr-2 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Nội dung không được lưu trữ trên hệ thống của chúng tôi.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-sm">Lịch sử tải xuống</h3>
              {history.length > 0 && (
                <button 
                  onClick={clearAllHistory}
                  className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest"
                >
                  Xóa hết
                </button>
              )}
            </div>
            
            <div className="p-2 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
              {history.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest px-4">Chưa có lịch sử</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <div 
                      key={item.id + item.timestamp}
                      onClick={() => handleDownload(item.originalUrl)}
                      className="group flex items-center p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
                    >
                      <div className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 relative">
                        <img src={item.cover} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                      <div className="ml-3 flex-grow min-w-0">
                        <h5 className="text-[11px] font-black text-slate-900 truncate leading-tight uppercase tracking-tight">@{item.authorNickname}</h5>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">{item.title}</p>
                        <div className="flex items-center mt-1 space-x-2">
                           <span className="text-[8px] font-black text-slate-300 uppercase">{formatTime(item.timestamp)}</span>
                           <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${item.type === 'slideshow' ? 'bg-blue-50 text-blue-400' : 'bg-pink-50 text-pink-400'}`}>
                             {item.type}
                           </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => removeFromHistory(item.id, e)}
                        className="ml-2 p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};