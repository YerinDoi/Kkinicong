import React, { useState } from 'react';
import Icon from '../common/icons';
import type { IconName } from '../common/icons';

interface Category {
  id: string;
  name: string;
  icon: IconName;
}

const categories: Category[] = [
  { id: 'all', name: '전체', icon: 'all' },
  { id: 'korean', name: '한식', icon: 'korean' },
  { id: 'western', name: '양식', icon: 'western' },
  { id: 'japanese', name: '일식', icon: 'japanese' },
  { id: 'chinese', name: '중식', icon: 'chinese' },
  { id: 'chicken', name: '치킨', icon: 'chicken' },
  { id: 'street-food', name: '분식', icon: 'streetFood' },
  { id: 'hotpot', name: '샤브샤브', icon: 'hotpot' },
  { id: 'asian', name: '아시안', icon: 'asian' },
  { id: 'lunch-box', name: '도시락', icon: 'lunchBox' },
  { id: 'snack', name: '간식', icon: 'snack' },
  { id: 'etc', name: '기타', icon: 'etc' },
];

interface MenuCategoryCarouselProps {
  onSelectCategory?: (category: string) => void;
}

const MenuCategoryCarousel: React.FC<MenuCategoryCarouselProps> = ({
  onSelectCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onSelectCategory?.(categoryId);
  };

  return (
    <div className="flex w-full overflow-x-auto scrollbar-hide gap-[24px] px-[20px] mb-[12px]">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className="flex flex-col items-center gap-[8px] pt-[8px] pb-[8px] relative cursor-pointer"
        >
          <div className="flex items-center justify-center h-[53px] w-auto">
            <button className="flex items-center justify-center">
              <Icon name={category.icon} />
            </button>
          </div>

          <span className="text-[#212121] text-center font-pretendard text-sm font-medium leading-[18px]">
            {category.name}
          </span>
          {selectedCategory === category.id && (
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-main-color" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuCategoryCarousel;
