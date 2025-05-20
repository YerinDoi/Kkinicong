import KakaoMap from '@/components/common/KakaoMap';
import { StoreDetail } from '@/types/store';
import { useState, useEffect } from 'react';
import MenuBtn from '@/assets/svgs/detail/menu-btn.svg?react';
import NavigationBtn from '@/assets/svgs/detail/navigation-btn.svg?react';
import axiosInstance from '@/api/axiosInstance';

interface StoreDetailMapProps {
  hideButtons?: boolean;
  store: StoreDetail;
}

const StoreDetailMap: React.FC<StoreDetailMapProps> = ({
  hideButtons = false,
  store,
}) => {
  // 메뉴 깇 찾기 URL 상태 추가
  const [externalLinks, setExternalLinks] = useState<{
    menuUrl?: string;
    directionUrl?: string;
  } | null>(null);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [errorLoadingLinks, setErrorLoadingLinks] = useState(false);

  // API 호출하여 외부 링크 가져오기
  useEffect(() => {
    const fetchExternalLinks = async () => {
      if (!store?.storeId) {
        // store 객체나 storeId가 없을 경우 호출 X
        console.log('store.storeId가 없어서 API 호출을 건너뜁니다:', store);
        setLoadingLinks(false);
        return;
      }
      try {
        setLoadingLinks(true);
        setErrorLoadingLinks(false);
        console.log('외부 링크 API 호출 시작:', store.storeId);
        const response = await axiosInstance.get(
          `/api/v1/store/${store.storeId}/external-links`,
        );
        console.log('외부 링크 API 응답:', response.data);
        if (response.data.isSuccess) {
          setExternalLinks(response.data.results);
        } else {
          // API 응답은 성공했으나 isSuccess가 false인 경우
          console.error('외부 링크 가져오기 실패:', response.data.message);
          setErrorLoadingLinks(true);
          setExternalLinks(null); // 링크 상태 초기화
        }
      } catch (err) {
        console.error('외부 링크를 불러오는데 실패했습니다.', err);
        setErrorLoadingLinks(true);
        setExternalLinks(null); // 링크 상태 초기화
      } finally {
        setLoadingLinks(false);
      }
    };

    fetchExternalLinks();
  }, [store?.storeId]);

  if (!store) {
    return <div>가맹점 정보를 찾을 수 없습니다.</div>;
  }

  const marker = [{ lat: store.latitude, lng: store.longitude }];
  const center = { lat: store.latitude, lng: store.longitude };

  const handleViewMenu = () => {
    // API에서 받은 menuUrl이 있으면 해당 URL로 이동
    if (externalLinks?.menuUrl) {
      console.log('메뉴 URL로 이동:', externalLinks.menuUrl);
      window.open(externalLinks.menuUrl, '_blank');
    } else {
      console.warn('메뉴 보러가기 URL을 찾을 수 없습니다.');
    }
  };

  const handleFindWay = () => {
    // API에서 받은 directionUrl이 있으면 해당 URL로 이동
    if (externalLinks?.directionUrl) {
      console.log('길 찾기 URL로 이동:', externalLinks.directionUrl);
      window.open(externalLinks.directionUrl, '_blank');
    } else {
      console.warn('길 찾기 URL을 찾을 수 없습니다.');
    }
  };

  return (
    <div>
      {/* 지도 영역 */}
      <div className="w-full h-[224px]">
        <KakaoMap center={center} markers={marker} />
      </div>

      {/* 버튼 영역 */}
      {!hideButtons && (
        <div className="flex gap-[8px] p-[16px]">
          <button
            onClick={handleViewMenu}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-[#FFF] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
            disabled={
              loadingLinks || errorLoadingLinks || !externalLinks?.menuUrl
            }
          >
            <MenuBtn />
            <span className="text-[16px] text-[#616161] leading-[20px] text-center">
              메뉴 보러가기
            </span>
          </button>

          <button
            onClick={handleFindWay}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-[#FFF] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
            disabled={
              loadingLinks || errorLoadingLinks || !externalLinks?.directionUrl
            }
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
