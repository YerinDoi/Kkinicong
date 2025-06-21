import { useNavigate } from 'react-router-dom';
import Icon, { IconName } from '@/assets/icons';
import axiosInstance from '@/api/axiosInstance';
import { categoryIconMap } from '@/constants/categories';
import { Store } from '@/types/store';

interface TopStoreItemProps {
  store: Store;
}

const TopStoreItem = ({ store }: TopStoreItemProps) => {
  const navigate = useNavigate();

  const handleStoreClick = () => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div
      className="p-[12px] bg-[#FEFEFE] z-50 shadow-custom rounded-[10px] w-[124px] h-[144px] "
      onClick={handleStoreClick}
    >
      <div className="self-stretch flex flex-col justify-between items-start ">
        <Icon
          name={categoryIconMap[store.category] || 'etc'}
          className="max-w-[42px] max-h-[42px] w-auto h-auto object-contain"
        />
        <div className="self-stretch flex flex-col justify-start items-start gap-[4px]">
          <div className="justify-start text-black text-base font-bold font-['Pretendard'] tracking-tight">
            {store.name}
          </div>
          <div className="justify-start text-[#919191] text-xs font-normal font-['Pretendard'] leading-none tracking-tight">
            {store.address}
          </div>
        </div>
      </div>
      <div className="self-stretch justify-start text-[#919191] text-xs font-normal font-['Pretendard'] leading-none tracking-tight">
        조회 {store.viewCount}
      </div>
    </div>
  );
};

export default TopStoreItem;
