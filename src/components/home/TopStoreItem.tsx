import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/assets/icons';
import { categoryIconMap } from '@/constants/categories';
import { Store } from '@/types/store';

interface TopStoreItemProps {
  store: Store;
}

const TopStoreItem = ({ store }: TopStoreItemProps) => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLDivElement | null>(null);
  const [isNameTwoLine, setIsNameTwoLine] = useState(false);

  useEffect(() => {
    if (nameRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(nameRef.current).lineHeight,
      );
      const height = nameRef.current.offsetHeight;
      const lineCount = Math.round(height / lineHeight);
      setIsNameTwoLine(lineCount >= 2);
    }
  }, [store.name]);

  const handleStoreClick = () => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div
      className="p-[12px] bg-[#FEFEFE] z-50 shadow-custom rounded-[10px] w-[124px] h-[160px]"
      onClick={handleStoreClick}
    >
      <div className="flex flex-col items-start gap-[6px] font-pretendard h-full">
        <Icon
          name={categoryIconMap[store.category] || 'etc'}
          className="max-w-[42px] max-h-[42px] w-auto h-auto object-contain"
        />
        <div className="flex flex-col justify-start items-start gap-[4px] w-full">
          {/* 가게 이름 */}
          <div
            ref={nameRef}
            className="leading-[1.1875] text-black text-base font-bold tracking-tight line-clamp-3"
          >
            {store.name}
          </div>

          {/* 주소: 항상 2줄로 제한 */}
          <div className="text-[#919191] text-xs font-normal tracking-tight line-clamp-2">
            {store.address}
          </div>

          {/* 조회수 */}
          <div className="mt-[4px] text-[#919191] text-xs font-normal tracking-tight">
            조회 {store.viewCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopStoreItem;
