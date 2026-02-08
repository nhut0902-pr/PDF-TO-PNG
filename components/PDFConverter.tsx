
import React, { useState, useRef, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFPageImage, ImageFormat } from '../types';

export const PDFConverter: React.FC = () => {
  const [images, setImages] = useState<PDFPageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>(ImageFormat.PNG);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thiết lập worker khi component mount
  useEffect(() => {
    const PDFJS_VERSION = '4.4.168';
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      const convertedImages: PDFPageImage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;

          const mimeType = selectedFormat;
          const extension = selectedFormat === ImageFormat.PNG ? 'png' : 'jpg';
          const dataUrl = canvas.toDataURL(mimeType, 0.85); // Giảm nhẹ quality để tránh crash RAM trên mobile
          
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

      setImages(convertedImages);
    } catch (error) {
      console.error('Lỗi xử lý PDF:', error);
      alert('Không thể đọc file PDF. Có thể file quá lớn hoặc không đúng định dạng.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = img.dataUrl;
        link.download = `supertool-page-${img.id}.${img.format}`;
        link.click();
      }, index * 400); // Tăng delay trên mobile để tránh nghẽn luồng tải
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 text-center">
        <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">PDF to Image</h2>
        <p className="text-gray-500 mb-8 text-sm">Chuyển đổi từng trang PDF sang định dạng ảnh mong muốn.</p>
        
        <div className="flex justify-center items-center space-x-3 mb-8">
          <button
            onClick={() => setSelectedFormat(ImageFormat.PNG)}
            className={`flex-1 max-w-[120px] py-3 rounded-2xl text-xs font-black transition-all border-2 ${
              selectedFormat === ImageFormat.PNG 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'
            }`}
          >
            PNG
          </button>
          <button
            onClick={() => setSelectedFormat(ImageFormat.JPG)}
            className={`flex-1 max-w-[120px] py-3 rounded-2xl text-xs font-black transition-all border-2 ${
              selectedFormat === ImageFormat.JPG 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'
            }`}
          >
            JPG
          </button>
        </div>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-100 transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span>ĐANG XỬ LÝ... {progress}%</span>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>CHỌN FILE PDF</span>
            </>
          )}
        </button>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100">
            <div className="text-left w-full md:w-auto">
              <h3 className="font-black text-gray-900">Kết quả ({images.length} trang)</h3>
              <p className="text-xs text-gray-400 uppercase font-bold">Định dạng: {selectedFormat === ImageFormat.PNG ? 'PNG' : 'JPG'}</p>
            </div>
            <button
              onClick={downloadAll}
              className="w-full md:w-auto px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100 flex items-center justify-center space-x-2"
            >
              <span>TẢI TẤT CẢ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="aspect-[3/4] overflow-hidden bg-slate-50 relative p-4">
                  <img src={img.dataUrl} alt={`Trang ${img.id}`} className="w-full h-full object-contain rounded-lg shadow-sm" loading="lazy" />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-300">#PAGE_{img.id}</span>
                  <a
                    href={img.dataUrl}
                    download={`page-${img.id}.${img.format}`}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all"
                  >
                    LƯU ẢNH
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
