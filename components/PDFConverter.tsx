
import React, { useState, useRef, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFPageImage, ImageFormat } from '../types';

interface PDFMetadata {
  name: string;
  size: number;
  pages: number;
}

export const PDFConverter: React.FC = () => {
  const [images, setImages] = useState<PDFPageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>(ImageFormat.PNG);
  const [scale, setScale] = useState(2.0); // Default 2x for good quality
  const [fileInfo, setFileInfo] = useState<PDFMetadata | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    const PDFJS_VERSION = '4.4.168';
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const estimateTotalSize = () => {
    if (!fileInfo) return '0 MB';
    // Rough estimate: A4 at 72dpi is ~1MB PNG, ~200KB JPG. 
    // Scale 2x = 4x pixels. Scale 3x = 9x pixels.
    const baseSize = selectedFormat === ImageFormat.PNG ? 0.8 : 0.25;
    const multiplier = Math.pow(scale, 2);
    const estimated = fileInfo.pages * baseSize * multiplier;
    return estimated.toFixed(1) + ' MB';
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Vui lòng chọn tệp PDF hợp lệ.');
      return;
    }

    setLoading(true);
    setProgress(0);
    setImages([]);
    stopRef.current = false;
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      setFileInfo({
        name: file.name,
        size: file.size,
        pages: pdf.numPages
      });

      const totalPages = pdf.numPages;
      const convertedImages: PDFPageImage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        if (stopRef.current) break;
        
        setCurrentTask(`Đang xử lý trang ${i}/${totalPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;

          const mimeType = selectedFormat;
          const extension = selectedFormat === ImageFormat.PNG ? 'png' : 'jpg';
          const dataUrl = canvas.toDataURL(mimeType, selectedFormat === ImageFormat.JPG ? 0.92 : 1);
          
          const response = await fetch(dataUrl);
          const blob = await response.blob();

          convertedImages.push({
            id: i,
            dataUrl,
            blob,
            format: extension as 'png' | 'jpg'
          });
        }
        setProgress(Math.round((i / totalPages) * 100));
        page.cleanup();
      }

      if (!stopRef.current) {
        setImages(convertedImages);
      }
    } catch (error) {
      console.error('PDF Error:', error);
      alert('Lỗi khi đọc file PDF. Có thể file bị khóa hoặc hỏng.');
    } finally {
      setLoading(false);
      setCurrentTask('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = img.dataUrl;
        link.download = `${fileInfo?.name.replace('.pdf', '')}-trang-${img.id}.${img.format}`;
        link.click();
      }, index * 350);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 animate-fade-in">
      {/* Header Info */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">
          PDF <span className="text-blue-600">to</span> IMAGE
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">
          Chuyển đổi tài liệu PDF của bạn thành hình ảnh chất lượng cao ngay trên trình duyệt. Bảo mật 100%.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Cấu hình xuất</h3>
            
            <div className="space-y-8">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3">ĐỊNH DẠNG ẢNH</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setSelectedFormat(ImageFormat.PNG)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${selectedFormat === ImageFormat.PNG ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    PNG (Nét)
                  </button>
                  <button
                    onClick={() => setSelectedFormat(ImageFormat.JPG)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${selectedFormat === ImageFormat.JPG ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    JPG (Nhẹ)
                  </button>
                </div>
              </div>

              {/* Quality Selection */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3">CHẤT LƯỢNG (DPI)</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  {[1.0, 2.0, 3.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${scale === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  {scale === 1.0 ? '⚡ Tốc độ nhanh nhất' : scale === 2.0 ? '✨ Độ phân giải tiêu chuẩn' : '💎 Siêu nét (Dành cho in ấn)'}
                </p>
              </div>

              {fileInfo && (
                <div className="pt-6 border-t border-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Tệp gốc</span>
                    <span className="text-[10px] font-black text-slate-900">{formatBytes(fileInfo.size)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Tổng số trang</span>
                    <span className="text-[10px] font-black text-slate-900">{fileInfo.pages} trang</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Ước lượng ảnh</span>
                    <span className="text-[10px] font-black text-emerald-500">~{estimateTotalSize()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload & Workspace Area */}
        <div className="lg:col-span-8 space-y-8">
          {!images.length && !loading ? (
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group h-[400px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                isDragging ? 'bg-blue-50 border-blue-400 scale-[0.99]' : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
              }`}
            >
              <input type="file" accept="application/pdf" onChange={(e) => e.target.files && handleFile(e.target.files[0])} ref={fileInputRef} className="hidden" />
              
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform"></div>
                 <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-blue-600">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                 </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Thả tệp PDF vào đây</h3>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">hoặc nhấn để chọn từ máy tính</p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-full max-w-md space-y-8 text-center">
                <div className="relative w-32 h-32 mx-auto">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                      <circle 
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * progress) / 100}
                        className="text-blue-600 transition-all duration-300 stroke-round" 
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-900">{progress}%</span>
                   </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{currentTask}</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Vui lòng không đóng trình duyệt</p>
                </div>

                <button 
                  onClick={() => { stopRef.current = true; setLoading(false); }}
                  className="px-8 py-3 bg-rose-50 text-rose-500 rounded-2xl font-black text-xs hover:bg-rose-100 transition-colors uppercase tracking-widest"
                >
                  Dừng chuyển đổi
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 line-clamp-1">{fileInfo?.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{images.length} trang đã hoàn thành</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button onClick={() => setImages([])} className="flex-1 sm:flex-none px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-100 transition-colors">Làm mới</button>
                  <button onClick={downloadAll} className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transform hover:-translate-y-1 transition-all">Tải tất cả</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((img) => (
                  <div key={img.id} className="group bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all">
                    <div className="aspect-[3/4] bg-slate-50 relative p-4 overflow-hidden">
                       <img src={img.dataUrl} alt={`Trang ${img.id}`} className="w-full h-full object-contain rounded-xl shadow-md transform group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
                       <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full">TRANG {img.id}</div>
                    </div>
                    <div className="p-6 flex items-center justify-between bg-white">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">.{img.format} Quality {scale}x</span>
                      <a
                        href={img.dataUrl}
                        download={`${fileInfo?.name.replace('.pdf', '')}-p${img.id}.${img.format}`}
                        className="p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-90"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
