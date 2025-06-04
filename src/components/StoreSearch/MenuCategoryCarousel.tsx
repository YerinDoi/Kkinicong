import React from 'react';
import { categories, Category } from '@/constants/categories';
import CategoryItem from '@/components/common/CategoryItem';

interface MenuCategoryCarouselProps {
  selectedCategory: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

const MenuCategoryCarousel: React.FC<MenuCategoryCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
  className,
}) => {
  return (
    <div
      className={`flex w-full overflow-x-auto scrollbar-hide gap-[22px] px-[20px] mb-[12px] ${className || ''}`}
    >
      {categories.map((category: Category) => (
        <div key={category.id} className="relative">
          <CategoryItem
            icon={category.icon}
            label={category.name}
            isSelected={selectedCategory === category.name}
            onClick={() => onSelectCategory?.(category.name)}
            variant="carousel"
          />
          {selectedCategory === category.name && (
            <div className="absolute bottom-0 left-0 right-0 border-b-2 border-main-color" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuCategoryCarousel;
