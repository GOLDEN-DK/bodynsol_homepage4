// 교육과정 인터페이스 정의
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  category: string;
  price: number | null;
  schedule: string | null;
  isActive: boolean;
  target: string | null;
  curriculum?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 카테고리 인터페이스 정의
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 배너 인터페이스 정의
export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  link?: string;
  isActive: boolean;
  order: number;
  mediaType?: string;
  transitionTime?: number;
  createdAt?: string;
  updatedAt?: string;
} 