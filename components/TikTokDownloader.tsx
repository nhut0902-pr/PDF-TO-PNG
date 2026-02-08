
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
      // Using TikWM API - a common free public API for TikTok downloading without watermarks
      // This is a reliable third-party service for client-side tools
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const result: TikTokData = await response.json();

      if (result.code === 0) {
        setData(result.data);
      } else {
        setError(result.msg || 'Không tìm thấy video. Vui lòng kiểm tra lại link.');
      }
    } catch (err) {
      console.error(err);
      setError('Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
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
      // Fallback if CORS prevents direct fetch
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">TikTok Downloader</h2>
        <p className="text-gray-500 mb-8 text-center">Tải Video hoặc Ảnh TikTok không logo chỉ trong giây lát.</p>
        
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link TikTok vào đây (vd: https://vt.tiktok.com/...)"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none pr-12"
            />
            {url && (
              <button 
                onClick={() => setUrl('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button
            onClick={handleDownload}
            disabled={loading || !url}
            className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${
              loading || !url ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <span>Bắt đầu tải</span>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {data && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-slide-up">
          <div className="p-6 border-b border-gray-50 flex items-center space-x-4">
            <img src={data.author.avatar} alt={data.author.nickname} className="w-12 h-12 rounded-full border border-gray-200" />
            <div>
              <h4 className="font-bold text-gray-900">{data.author.nickname}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">{data.title}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-xl overflow-hidden bg-gray-900 aspect-[9/16] relative flex items-center justify-center">
                {data.images && data.images.length > 0 ? (
                  <div className="w-full h-full overflow-y-auto grid grid-cols-1 gap-1">
                    {data.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Slide ${idx}`} className="w-full h-auto" />
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

              <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Tùy chọn tải xuống</h3>
                
                {data.images && data.images.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-500">Đây là bài đăng dạng ảnh ({data.images.length} ảnh).</p>
                    <div className="grid grid-cols-1 gap-2">
                      {data.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => saveFile(img, `tiktok-image-${data.id}-${idx}.jpeg`)}
                          className="w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-between"
                        >
                          <span>Tải ảnh {idx + 1}</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => saveFile(data.play, `tiktok-video-${data.id}.mp4`)}
                      className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center space-x-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Tải Video (Không logo)</span>
                    </button>
                    
                    <button
                      onClick={() => saveFile(data.music, `tiktok-audio-${data.id}.mp3`)}
                      className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span>Tải Nhạc (MP3)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
