import CategoryItem from '@/components/common/CategoryItem';
import { categories } from '@/constants/categories';
import { useNavigate } from 'react-router-dom';

function CategorySection() {
  const navigate = useNavigate();
  const handleClick = (categoryName: string) => {
    navigate('/store-search', {
      state: { selectedCategory: categoryName },
    });
  };

  const mainCategories = categories.slice(1, -1);
  return (
    <div className="px-[16px] pb-[20px] border-b-8 border-[#F4F6F8]">
      <div className="grid grid-cols-5 gap-x-[20px] gap-y-[16px]">
        {mainCategories.map((category) => (
          <CategoryItem
            key={category.id}
            icon={category.icon}
            label={category.name}
            onClick={() => handleClick(category.name)}
            variant="main"
          />
        ))}
      </div>
    </div>
  );
}

export default CategorySection;
