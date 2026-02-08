
import React, { useState } from 'react';
import { TikTokData } from '../types';

export const TikTokDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TikTokData['data'] | null>(null);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      // API TikWM support watermark-free content
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const result: TikTokData = await response.json();

      if (result.code === 0) {
        setData(result.data);
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

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">TikTok Downloader</h2>
        <p className="text-gray-500 mb-8 text-center text-lg">Tải Video/Ảnh không logo nhanh chóng</p>
        
        <div className="flex flex-col space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link video hoặc slideshow TikTok..."
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-50 transition-all outline-none pr-14 text-lg"
            />
            {url && (
              <button 
                onClick={() => setUrl('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button
            onClick={handleDownload}
            disabled={loading || !url}
            className={`w-full py-5 rounded-2xl text-white font-black text-xl shadow-xl transition-all transform active:scale-[0.97] flex items-center justify-center space-x-3 ${
              loading || !url ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 hover:shadow-pink-200'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-3.3 2.97-5.92 6.25-6.04.53-.03 1.07.03 1.6.14v4.35c-.44-.1-.91-.12-1.36-.08-1.45.13-2.73 1.2-3.08 2.6-.17.65-.18 1.34-.03 2 .25 1.19 1.1 2.21 2.23 2.65.68.28 1.43.34 2.15.22 1.25-.19 2.3-.98 2.82-2.12.28-.58.42-1.22.41-1.87-.01-4.57.01-9.14-.02-13.71z"/>
                </svg>
                <span>TẢI NGAY</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center font-medium animate-shake">
            {error}
          </div>
        )}
      </div>

      {data && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
          <div className="p-6 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={data.author.avatar} alt={data.author.nickname} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
              <div>
                <h4 className="font-black text-gray-900 text-lg">@{data.author.nickname}</h4>
                <p className="text-sm text-gray-500 max-w-md line-clamp-1">{data.title}</p>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${data.images ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
              {data.images ? 'Slideshow' : 'Video'}
            </span>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-1/3 flex-shrink-0">
                <div className="rounded-2xl overflow-hidden bg-black aspect-[9/16] relative shadow-lg group">
                  {data.images && data.images.length > 0 ? (
                    <div className="h-full overflow-y-auto no-scrollbar scroll-smooth p-1 bg-gray-100">
                      {data.images.map((img, idx) => (
                        <div key={idx} className="relative mb-1 last:mb-0 group/img">
                           <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-auto rounded-lg" />
                           <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">#{idx+1}</div>
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

              <div className="lg:w-2/3 flex flex-col justify-start space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Sẵn sàng tải xuống!</h3>
                  <p className="text-gray-500">Mọi thứ đã sẵn sàng. Hãy chọn nội dung bạn muốn lưu lại.</p>
                </div>
                
                {data.images && data.images.length > 0 ? (
                  <div className="space-y-4">
                    <button
                      onClick={downloadAllImages}
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center space-x-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>TẢI TẤT CẢ ({data.images.length} ẢNH)</span>
                    </button>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {data.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => saveFile(img, `tiktok-img-${idx + 1}.jpeg`)}
                          className="py-2.5 px-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                          <span>Ảnh {idx + 1}</span>
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => saveFile(data.play, `tiktok-no-wm-${data.id}.mp4`)}
                      className="w-full py-5 bg-pink-600 text-white rounded-2xl font-black text-lg hover:bg-pink-700 transition-all shadow-xl flex items-center justify-center space-x-3"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>TẢI VIDEO (NO WATERMARK)</span>
                    </button>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => saveFile(data.music, `tiktok-audio-${data.id}.mp3`)}
                        className="py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span>Lưu MP3</span>
                      </button>
                      <button
                        onClick={() => saveFile(data.wmplay, `tiktok-with-wm-${data.id}.mp4`)}
                        className="py-4 border border-gray-200 text-gray-500 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        <span>Video Gốc (Có logo)</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center text-xs text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Chúng tôi không lưu trữ bất kỳ nội dung nào của bạn trên máy chủ.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};
