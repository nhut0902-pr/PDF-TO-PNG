
export interface TikTokData {
  code: number;
  msg: string;
  data: {
    id: string;
    title: string;
    cover: string;
    play: string; // Video no watermark
    wmplay: string; // Video with watermark
    images?: string[]; // If it's a slideshow
    music: string;
    author: {
      nickname: string;
      avatar: string;
    };
  };
}

export interface PDFPageImage {
  id: number;
  dataUrl: string;
  blob: Blob;
}

export enum ToolType {
  PDF_TO_IMAGE = 'PDF_TO_IMAGE',
  TIKTOK_DOWNLOADER = 'TIKTOK_DOWNLOADER'
}
