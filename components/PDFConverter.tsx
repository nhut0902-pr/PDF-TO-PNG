
import React, { useState, useCallback, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFPageImage } from '../types';

// PDFJS worker must be loaded from CDN for standard React environment without complex build config
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PDFConverter: React.FC = () => {
  const [images, setImages] = useState<PDFPageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const convertedImages: PDFPageImage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;

          const dataUrl = canvas.toDataURL('image/png');
          
          // Convert dataURL to blob for efficient download handling if needed later
          const response = await fetch(dataUrl);
          const blob = await response.blob();

          convertedImages.push({
            id: i,
            dataUrl,
            blob
          });
        }
        setProgress(Math.round((i / totalPages) * 100));
      }

      setImages(convertedImages);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Không thể xử lý file PDF này. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = async () => {
    // In a real production app, we might use JSZip here. 
    // For this demo, we'll download them individually or the user can save one by one.
    // To keep it simple without extra heavy libs:
    images.forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = img.dataUrl;
        link.download = `page-${img.id}.png`;
        link.click();
      }, index * 200);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Chuyển đổi PDF sang Ảnh</h2>
        <p className="text-gray-500 mb-6">Tải lên file PDF và chúng tôi sẽ tách từng trang thành ảnh PNG chất lượng cao.</p>
        
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        
        <button
          onClick={triggerFileInput}
          disabled={loading}
          className={`flex items-center justify-center space-x-2 mx-auto px-8 py-4 rounded-xl text-white font-semibold shadow-lg transition-all transform active:scale-95 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang xử lý {progress}%...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Chọn file PDF</span>
            </>
          )}
        </button>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Kết quả ({images.length} trang)</h3>
            <button
              onClick={downloadAll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Tải tất cả</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                  <img src={img.dataUrl} alt={`Trang ${img.id}`} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Trang {img.id}</span>
                  <a
                    href={img.dataUrl}
                    download={`page-${img.id}.png`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
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
