import React,{ useState } from "react";
import CheckboxIcon from "@/assets/svgs/review/checkbox.svg";
import UncheckedIcon from "@/assets/svgs/review/unchecked-box.svg";
interface CheckBoxProps {
  onCheckChange: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({onCheckChange }) => {
  const [checked, setChecked] = useState(false);
  
  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onCheckChange(newValue); 
  };
  
  return (
    <div className="flex flex-col gap-[12px] ">
      <p className="text-black font-semibold leading-[20px] text-title-sb-button">
        직접 이용 후 작성하시는 리뷰인가요?
      </p>
      <label className="flex items-center gap-[8px] cursor-pointer select-none">
      
        <div onClick={handleToggle} className="w-[20px] h-[20px]">
          <img
            src={checked ? CheckboxIcon : UncheckedIcon}
            alt="체크박스"
            className="w-full h-full"
          />
        </div>


        <span className={checked ? "text-title-sb-button text-black font-semibold " : "text-[#919191]"}> 
          네, 실제로 방문해 급식카드로 이용했어요.
        </span>
      </label>
    </div>
  );
};

export default CheckBox;