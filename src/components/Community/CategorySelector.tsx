// import { useState } from 'react';
// import ORadioIcon from '@/assets/icons/system/radioO.svg'; // 라디오 아이콘
// import XRadioIcon from '@/assets/icons/system/radioX.svg'; // 라디오 아이콘

// interface CategorySelectorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const CATEGORY_LIST = [
//   { label: '복지정보', value: 'WELFARE_INFO' },
//   { label: '잡담해요', value: 'CHITCHAT' },
//   { label: '양육/육아', value: 'PARENTING' },
//   { label: '문의/도움', value: 'QUESTION_HELP' },
//   { label: '생활꿀팁', value: 'LIFE_TIP' },
//   { label: '칭찬/감사', value: 'APPRECIATION' },
//   { label: '기타', value: 'ETC' },
// ];

// export default function CategorySelector({
//   value,
//   onChange,
// }: CategorySelectorProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleSelect = (categoryValue: string) => {
//     onChange(categoryValue);
//     setIsOpen(false);
//   };

//   const selectedLabel = CATEGORY_LIST.find(
//     (item) => item.value === value,
//   )?.label;

//   return (
//     <div>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="w-full border-[1px] border-[#C3C3C3] rounded-[12px] px-4 py-3 text-left text-body-md-description fort-reular text-[#919191]"
//       >
//         {selectedLabel || '카테고리를 선택하세요'}
//       </button>

//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-10"
//           onClick={() => setIsOpen(false)}
//         >
//           <div
//             className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 z-20"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="text-body-md-title text-center font-regular mb-3">
//               게시글 카테고리
//             </div>
//             <ul className="space-y-2">
//               {CATEGORY_LIST.map(({ label, value: categoryValue }) => (
//                 <li key={categoryValue}>
//                   <button
//                     onClick={() => handleSelect(categoryValue)}
//                     className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
//                       value === categoryValue
//                         ? 'bg-green-100 font-semibold'
//                         : ''
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState ,useEffect} from 'react';
import { labelToValueMap } from '@/api/community';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CATEGORY_LIST = Object.entries(labelToValueMap).map(([label, value]) => ({
  label,
  value,
}));


export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
  setTempValue(value);
}, [value]);

  const selectedLabel = CATEGORY_LIST.find(
    (item) => item.value === value,
  )?.label;

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
          setTempValue(value);
        }}
        className="w-full border-[1px] border-[#C3C3C3] rounded-[12px] px-4 py-3 text-left text-body-md-description font-regular text-[#919191]"
      >
        {selectedLabel || '게시글의 카테고리를 선택해주세요'}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-30"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[16px] px-[40px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-[14px] py-2 mt-2">
              게시글 카테고리
            </h2>

            <ul className="space-y-2 border-t py-3">
              {CATEGORY_LIST.map(({ label, value: categoryValue }) => (
                <li key={categoryValue}>
                  <button
                    onClick={() => setTempValue(categoryValue)}
                    className="w-full flex items-center gap-5 px-2 py-2 text-left"
                  >
                    <div
                      className={`w-[24px] h-[24px] rounded-full flex items-center justify-center bg-[#E6E6E6]`}
                    >
                      {tempValue === categoryValue && (
                        <div className="w-[18px] h-[18px] bg-[#65CE58] rounded-full" />
                      )}
                    </div>
                    <span className="text-title-sb-button font-semibold">
                      {label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* 하단 버튼 영역 */}
            <div className="flex justify-between border-t p-4">
              <button
                className="w-1/2 text-center text-body-bd-title font-bold"
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button
                className="w-1/2 text-center text-body-bd-title font-bold"
                onClick={() => {
                  onChange(tempValue);
                  setIsOpen(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
