import Icon from '@/assets/icons';
import type { IconName } from '@/assets/icons';

const styleVariants = {
  main: {
    wrapper: 'h-[85px]',
    text: 'text-body-md-description font-regular',
  },
  carousel: {
    wrapper: 'w-[60px] h-[100px] py-[8px] gap-[8px]',
    text: 'text-[13px]',
  },
} as const;
interface CategoryItemProps {
  icon: IconName;
  label: string;
  isSelected?:boolean;
  onClick: () => void;
  variant: keyof typeof styleVariants;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  icon,label, isSelected, onClick,variant,
}) => {
  const styles = styleVariants[variant];
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center relative cursor-pointer ${styles.wrapper}`}
    >
      <div className="flex items-center justify-center w-full h-full object-contain px-[4px]">
        <button className="flex items-center justify-center">
          <Icon name={icon} />
        </button>
      </div>

      <span className={`text-[#212121] text-center leading-[18px]  ${styles.text}`}>
        {label}
      </span>

     
    </div>
  );
};

export default CategoryItem;