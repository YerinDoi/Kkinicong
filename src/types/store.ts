export interface Review {
  id: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
  images?: string[];
}

export type Weekday = '일' | '월' | '화' | '수' | '목' | '금' | '토';

export type WeeklyHours = {
  [key in Weekday]: [string, string] | null;
};


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
  lat: number;  // 위도
  lng: number;  // 경도
  rating: number;
  favoriteCount: number;
  businessHours: {
    open: string;
    close:string;
    isOpen: boolean;
    weekly?: WeeklyHours;
  };
  reviews: Review[];
  reviewCount: number;
  status: '영업중' | '영업 종료' ;
  statusDescription?: string;
}
