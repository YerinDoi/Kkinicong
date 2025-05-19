import React, { useState } from 'react';
import Icon from '../../assets/icons';
import type { IconName } from '../../assets/icons';

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
  { id: 'street-food', name: '분식', icon: 'street-food' },
  { id: 'hotpot', name: '샤브샤브', icon: 'hotpot' },
  { id: 'asian', name: '아시안', icon: 'asian' },
  { id: 'lunch-box', name: '도시락', icon: 'lunch-box' },
  { id: 'snack', name: '간식', icon: 'snack' },
  { id: 'etc', name: '기타', icon: 'etc' },
];

interface MenuCategoryCarouselProps {
  selectedCategory: string;
  onSelectCategory?: (category: string) => void;
}

const MenuCategoryCarousel: React.FC<MenuCategoryCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory?.(categoryName);
  };

  return (
    <div className="flex w-full overflow-x-auto scrollbar-hide gap-[22px] px-[20px] mb-[12px]">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.name)}
          className="flex flex-col items-center w-[60px] h-[100px] gap-[8px] py-[8px] relative cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-full object-contain px-[4px]">
            <button className="flex items-center justify-center ">
              <Icon name={category.icon} />
            </button>
          </div>

          <span className="text-[#212121] text-center text-sm font-medium leading-[18px]">
            {category.name}
          </span>
          {selectedCategory === category.name && (
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-main-color" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuCategoryCarousel;
