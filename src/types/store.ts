export interface Review {
  id: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
  images?: string[];
}

export interface Store {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  mainTag: string;
  address: string;
  rating: number;
  favoriteCount: number;
  businessHours: {
    open: string;
    close: string;
    isOpen: boolean;
  };
  reviews: Review[];
  reviewCount: number;
  status: '영업중' | '영업 종료' | '휴무' | '준비중';
  statusDescription?: string;
}
