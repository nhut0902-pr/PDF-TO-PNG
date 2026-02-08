
import React, { useState, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFPageImage, ImageFormat } from '../types';

// Sử dụng phiên bản 4.4.168 đồng nhất
const PDFJS_VERSION = '4.4.168';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

export const PDFConverter: React.FC = () => {
  const [images, setImages] = useState<PDFPageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>(ImageFormat.PNG);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          const dataUrl = canvas.toDataURL(mimeType, 0.9);
          
          const response = await fetch(dataUrl);
          const blob = await response.blob();

          convertedImages.push({
            id: i,
            dataUrl,
            blob,
            format: extension
          });
        }
        setProgress(Math.round((i / totalPages) * 100));
        // Giải phóng bộ nhớ trang sau khi render
        page.cleanup();
      }

      setImages(convertedImages);
    } catch (error) {
      console.error('Lỗi PDF:', error);
      alert('Không thể xử lý file PDF. Vui lòng kiểm tra lại file của bạn.');
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
        link.download = `page-${img.id}.${img.format}`;
        link.click();
      }, index * 300);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Chuyển PDF sang Ảnh</h2>
        <p className="text-gray-500 mb-8 text-sm md:text-base">Tách trang PDF thành định dạng PNG hoặc JPG chất lượng cao.</p>
        
        <div className="flex justify-center items-center space-x-4 mb-8">
          <span className="text-sm font-semibold text-gray-600 uppercase">Định dạng:</span>
          <div className="inline-flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setSelectedFormat(ImageFormat.PNG)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedFormat === ImageFormat.PNG 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              PNG
            </button>
            <button
              onClick={() => setSelectedFormat(ImageFormat.JPG)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedFormat === ImageFormat.JPG 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              JPG
            </button>
          </div>
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
          className={`w-full md:w-auto flex items-center justify-center space-x-2 mx-auto px-10 py-4 rounded-2xl text-white font-bold shadow-lg transition-all transform active:scale-95 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang tách... {progress}%</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>CHỌN FILE PDF</span>
            </>
          )}
        </button>
      </div>

      {images.length > 0 && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800">Đã tách {images.length} trang</h3>
            <button
              onClick={downloadAll}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>TẢI TẤT CẢ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative p-2">
                  <img src={img.dataUrl} alt={`Trang ${img.id}`} className="w-full h-full object-contain rounded-lg shadow-inner" />
                </div>
                <div className="p-4 flex justify-between items-center bg-gray-50/50">
                  <span className="text-xs font-black text-gray-400 uppercase">Trang {img.id}</span>
                  <a
                    href={img.dataUrl}
                    download={`page-${img.id}.${img.format}`}
                    className="flex items-center space-x-1 px-4 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>LƯU</span>
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
