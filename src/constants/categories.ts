import type { IconName } from '@/assets/icons';

export interface Category {
  id: string;
  name: string;
  icon: IconName;
}
export const categories: Category[] = [
  { id: 'all', name: '전체', icon: 'all' },
  { id: 'korean', name: '한식', icon: 'korean' },
  { id: 'western', name: '양식', icon: 'western' },
  { id: 'japanese', name: '일식', icon: 'japanese' },
  { id: 'chinese', name: '중식', icon: 'chinese' },
  { id: 'chicken', name: '치킨', icon: 'chicken' },
  { id: 'street-food', name: '분식', icon: 'street-food' },
  { id: 'hotpot', name: '샤브샤브', icon: 'hotpot' },
  { id: 'asian', name: '아시안', icon: 'asian' },
  { id: 'lunch-box', name: '도시락', icon: 'lunch-box' },
  { id: 'snack', name: '간식', icon: 'snack' },
  { id: 'etc', name: '기타', icon: 'etc' },
];

export const categoryIconMap = Object.fromEntries(
  categories.map((cat) => [cat.name, cat.icon]),
);
