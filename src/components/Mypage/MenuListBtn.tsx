import ChevronRightIcon from '@/assets/svgs/common/chevron-right-gray.svg';

interface MenuListBtnProps {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'secondary'; // 스타일 분기용
}

const MenuListBtn = ({
  label,
  onClick,
  variant = 'default',
}: MenuListBtnProps) => {
  const style =
    variant === 'default' 
      ? 'w-full flex items-center px-[20px] py-[16px] self-stretch rounded-[20px] bg-[#F3F5ED]'
      : 'w-full flex items-center px-[20px] py-[8px] self-stretch rounded-[16px] bg-bg-gray';

  const textStyle = variant === 'default' ? 'text-[16px] font-semibold leading-[20px]' : 'text-[14px] font-normal leading-[24px]';

  return (
    <button
        type="button"
        onClick={onClick}
        className={`justify-between ${style}`}
    >
        <span className={`font-pretendard text-text-gray ${textStyle}`}>{label}</span>
        <img src={ChevronRightIcon} className="flex-shrink-0" />
    </button>
  );
};

export default MenuListBtn;
