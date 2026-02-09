
export interface TikTokData {
  code: number;
  msg: string;
  data: {
    id: string;
    title: string;
    cover: string;
    play: string;
    wmplay: string;
    images?: string[];
    music: string;
    author: {
      nickname: string;
      avatar: string;
    };
  };
}

export interface HistoryItem {
  id: string;
  title: string;
  cover: string;
  authorNickname: string;
  authorAvatar: string;
  timestamp: number;
  type: 'video' | 'slideshow';
  originalUrl: string;
}

export enum ImageFormat {
  PNG = 'image/png',
  JPG = 'image/jpeg'
}

export interface PDFPageImage {
  id: number;
  dataUrl: string;
  blob: Blob;
  format: 'png' | 'jpg';
}

export enum ToolType {
  PDF_TO_IMAGE = 'PDF_TO_IMAGE',
  TIKTOK_DOWNLOADER = 'TIKTOK_DOWNLOADER',
  REWARD_CENTER = 'REWARD_CENTER',
  PRICING = 'PRICING',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY'
}

export type Language = 'vi' | 'en';
export type Theme = 'light' | 'dark';
