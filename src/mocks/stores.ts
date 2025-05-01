import { Store } from '@/types/store';

export const mockStores: Store[] = [
  {
    id: '1',
    name: '채움편백찜샤브샤브',
    category: {
      id: 'shabu shabu',
      name: '샤브샤브',
      icon: 'shabu shabu',
    },
    mainTag: '재료가 신선해요',
    address: '인천광역시 서구 크리스탈로 78',
    rating: 4.2,
    favoriteCount: 1,
    businessHours: {
      open: '21:30',
      close: '21:00',
      isOpen: true,
    },
    reviews: [
      {
        id: '1',
        userName: '베고픈 콩쥐',
        rating: 3,
        content: '일주일에 한 번은 꼭 가는 맛집입니다... 추천합니다',
        date: '2025.04.09',
      },
      {
        id: '2',
        userName: '먹방 콩쥐',
        rating: 5,
        content: '너무 맛있어요!! 아주머니가 친절하세요 ㅎㅎ 다음에 또 올게요~',
        date: '2025.04.09',
      },
    ],
    reviewCount: 127,
    status: '영업중',
  },
  {
    id: '2',
    name: '스시 진심',
    category: {
      id: 'japanese',
      name: '일식',
      icon: 'japanese',
    },
    mainTag: '음식이 맛있어요',
    address: '인천광역시 서구 청라동 19번길',
    rating: 4.7,
    favoriteCount: 1,
    businessHours: {
      open: '11:30',
      close: '21:00',
      isOpen: true,
    },
    reviews: [],
    reviewCount: 0,
    status: '영업중',
  },
  {
    id: '3',
    name: '장모한상 인천서구',
    category: {
      id: 'korean',
      name: '한식',
      icon: 'korean',
    },
    mainTag: '재료가 신선해요',
    address: '인천광역시 서구 염주로 119',
    rating: 4.7,
    favoriteCount: 1,
    businessHours: {
      open: '09:00',
      close: '21:00',
      isOpen: false,
    },
    reviews: [],
    reviewCount: 0,
    status: '영업 종료',
  },
];
