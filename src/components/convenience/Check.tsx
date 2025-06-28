import CheckboxIcon from '@/assets/svgs/review/checkbox.svg';
import UncheckedIcon from '@/assets/svgs/review/unchecked-box.svg';

interface CheckProps {
  checked: boolean; // 현재 체크 상태
  onChange: (checked: boolean) => void; // 체크 상태 변경 핸들러
  label?: string; // 체크박스 옆에 표시할 라벨 텍스트
  hideLabelText?: boolean; // 라벨 텍스트 숨기기 옵션
  iconCheckedSrc?: string; // 체크O 아이큰
  iconUncheckedSrc?: string; // 체크X 아이콘
  className?: string;
}

const Check: React.FC<CheckProps> = ({
  checked,
  onChange,
  label = '체크박스',
  hideLabelText = false,
  className = '',
  iconCheckedSrc = CheckboxIcon,
  iconUncheckedSrc = UncheckedIcon,
}) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <label
      className={`flex items-center gap-[8px] cursor-pointer select-none text-body-md-title ${className}`}
    >
      <div onClick={handleToggle} className="w-[24px] h-[24px]">
        <img
          src={checked ? iconCheckedSrc : iconUncheckedSrc}
          alt="체크박스"
          className="w-full h-full"
        />
      </div>

      {!hideLabelText && (
        <span className={checked ? 'text-black ' : 'text-[#919191]'}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Check;
