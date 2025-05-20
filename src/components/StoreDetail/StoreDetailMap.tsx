import KakaoMap from '@/components/common/KakaoMap';
import { mockStores } from '@/mocks/stores';
import { useParams, useNavigate } from 'react-router-dom';
import MenuBtn from '@/assets/svgs/detail/menu-btn.svg?react';
import NavigationBtn from '@/assets/svgs/detail/navigation-btn.svg?react';

interface StoreDetailMapProps {
  hideButtons?: boolean;
}

const StoreDetailMap: React.FC<StoreDetailMapProps>  = ({ hideButtons = false }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const store = mockStores.find((store) => store.id === storeId);

  if (!store) {
    return <div className='px-[16px]'>가맹점 정보를 찾을 수 없습니다.</div>;
  }

  const marker = [{ lat: store.lat, lng: store.lng }];
  const center = { lat: store.lat, lng: store.lng };

  const handleViewMenu = () => {
    const encodedName = encodeURIComponent(store.name);
    const url = `https://m.search.naver.com/search.naver?where=m&sm=mtb_jum&query=${encodedName}`;
    window.open(url, '_blank');
  };

  const handleFindWay = () => {
    // 네이버 길찾기 URL 생성
    const encodedName = encodeURIComponent(store.name);
    const url = `https://map.naver.com/v5/search/${encodedName}/place/${store.lng},${store.lat}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <div className="w-full h-[224px]">
        <KakaoMap center={center} markers={marker} />
      </div>

      {!hideButtons && (
        <div className="flex gap-[8px] p-[16px]">
          <button
            onClick={handleViewMenu}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-[#FFF] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
          >
            <MenuBtn />
            <span className="text-[16px] text-[#616161] leading-[20px] text-center">
              메뉴 보러가기
            </span>
          </button>

          <button
            onClick={handleFindWay}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-[#FFF] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
          >
            <NavigationBtn />
            <span className="text-[16px] text-[#616161] leading-[20px] text-center">
              길 찾기
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreDetailMap;
