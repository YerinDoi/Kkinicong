import { Store } from '@/types/store';

export const mockStores: Store[] = [
  {
    id: '1',
    name: '스시 진심',
    category: {
      id: 'japanese',
      name: '일식',
      icon: 'japanese',
    },
    mainTag: '음식이 맛있어요',
    address: '인천광역시 서구 청마로 19번길',
    lat: 37.592587,
    lng: 126.6730328,
    rating: 4.7,
    favoriteCount: 1,
    businessHours: {
      open: '11:30',
      close: '21:00',
      isOpen: true,
      weekly: {
        일: ['11:30', '21:30'],
        월: ['11:00', '21:00'],
        화: ['11:30', '21:00'],
        수: ['11:30', '21:30'],
        목: ['11:30', '21:30'],
        금: ['11:30', '21:30'],
        토: ['11:30', '21:30'],
      },
    },
    reviews: [
      {
        id: '1',
        userName: '배고픈 콩쥐',
        rating: 3,
        content: '일주일에 한 번은 꼭 가는 맛집입니다... 추천합니다',
        date: '2025.04.09',
        isOwner: false,
      },
      {
        id: '2',
        userName: '먹방 콩쥐',
        rating: 5,
        content: '너무 맛있어요!! 아주머니가 친절하세요 ㅎㅎ 다음에 또 올게요~',
        date: '2025.04.09',
        isOwner: true,
      },
    ],
    reviewCount: 127,
    status: '영업중',
  },
  {
    id: '2',
    name: '채움편백짐샤브샤브',
    category: {
      id: 'hotpot',
      name: '샤브샤브',
      icon: 'hotpot',
    },
    mainTag: '재료가 신선해요',
    address: '인천광역시 서구 크리스탈로 78',
    lat: 37.532,
    lng: 126.636793,
    rating: 4.2,
    favoriteCount: 356,
    businessHours: {
      open: '11:30',
      close: '21:00',
      isOpen: true,
      weekly: {
        일: null, // 정기휴무
        월: ['11:30', '21:30'],
        화: ['11:30', '21:30'],
        수: ['11:30', '21:30'],
        목: ['11:30', '21:30'],
        금: ['11:30', '21:30'],
        토: ['11:30', '21:30'],
      },
    },
    reviews: [],
    reviewCount: 0,
    status: '영업중',
  },
  {
    id: '3',
    name: '일 아르도레',
    category: {
      id: 'western',
      name: '양식',
      icon: 'western',
    },
    mainTag: '분위기가 좋아요',
    address: '인천광역시 서구 가정동 612-23',
    lat: 37.529038,
    lng: 126.670091,
    rating: 4.7,
    favoriteCount: 1,
    businessHours: {
      open: '09:00',
      close: '21:00',
      isOpen: false,
      weekly: {
        일: ['11:00', '21:30'],
        월: ['11:00', '21:30'],
        화: ['11:00', '21:30'],
        수: ['11:00', '21:30'],
        목: ['11:00', '21:30'],
        금: ['11:00', '22:30'],
        토: null,
      },
    },
    reviews: [],
    reviewCount: 0,
    status: '영업 종료',
  },
  {
    id: '4',
    name: '장모한상 인천서구',
    category: {
      id: 'korean',
      name: '한식',
      icon: 'korean',
    },
    mainTag: '재료가 신선해요',
    address: '인천광역시 서구 여우재로 119',
    lat: 37.490295,
    lng: 126.685726,
    rating: 4.7,
    favoriteCount: 1,
    businessHours: {
      open: '09:00',
      close: '21:00',
      isOpen: false,
      weekly: {
        일: ['8:00', '21:30'],
        월: ['8:00', '21:30'],
        화: ['8:00', '21:30'],
        수: ['8:00', '21:30'],
        목: ['8:00', '21:30'],
        금: ['11:00', '21:30'],
        토: null,
      },
    },
    reviews: [],
    reviewCount: 0,
    status: '영업 종료',
  },
  {
    id: '5',
    name: '한솥도시락 인천가정점',
    category: {
      id: 'lunch-box',
      name: '도시락',
      icon: 'lunch-box',
    },
    mainTag: '이야기하기 좋아요',
    address: '인천광역시 서구 봉오재3로 100',
    lat: 37.527388,
    lng: 126.670755,
    rating: 4.7,
    favoriteCount: 1,
    businessHours: {
      open: '09:00',
      close: '21:00',
      isOpen: false,
      weekly: {
        일: ['9:00', '21:00'],
        월: ['9:00', '21:00'],
        화: ['9:00', '21:00'],
        수: ['9:00', '21:00'],
        목: ['9:00', '21:00'],
        금: ['9:00', '21:00'],
        토: ['9:00', '21:00'],
      },
    },
    reviews: [],
    reviewCount: 0,
    status: '영업 종료',
  },
  {
    id: '6',
    name: '미분당 청라점',
    category: {
      id: 'asian',
      name: '아시안',
      icon: 'asian',
    },
    mainTag: '결제 거절이 없어요',
    address: '인천광역시 서구 청라라임로 85',
    lat: 37.534524,
    lng: 126.652643,
    rating: 4.7,
    favoriteCount: 1,
    businessHours: {
      open: '09:00',
      close: '21:00',
      isOpen: false,
      weekly: {
        일: ['9:00', '21:00'],
        월: ['9:00', '21:00'],
        화: ['9:00', '21:00'],
        수: ['9:00', '21:00'],
        목: ['9:00', '21:00'],
        금: ['9:00', '21:00'],
        토: ['9:00', '21:00'],
      },
    },

    reviews: [],
    reviewCount: 0,
    status: '영업 종료',
  },
  {
    id: '7',
    name: '청춘통닭 검단오류점',
    category: {
      id: 'chicken',
      name: '치킨',
      icon: 'chicken',
    },
    mainTag: '주차하기 편리해요',
    address: '인천광역시 서구 단봉로 97-7',
    lat: 37.596809,
    lng: 126.640345,
    rating: 4.3,
    favoriteCount: 1,
    businessHours: {
      open: '09:00',
      close: '24:00',
      isOpen: false,
      weekly: {
        일: ['17:00', '24:00'],
        월: null,
        화: ['17:00', '24:00'],
        수: ['17:00', '24:00'],
        목: ['17:00', '24:00'],
        금: ['17:00', '24:00'],
        토: ['17:00', '24:00'],
      },
    },
    reviews: [],
    reviewCount: 0,
    status: '영업 종료',
  },
];
