import KakaoMap, {
  MARKER,
  MARKER_IMAGE_SIZE,
} from '@/components/common/KakaoMap';
import { StoreDetail } from '@/types/store';
import { useState, useEffect, useRef } from 'react';
import MenuBtn from '@/assets/svgs/detail/menu-btn.svg?react';
import NavigationBtn from '@/assets/svgs/detail/navigation-btn.svg?react';
import axiosInstance from '@/api/axiosInstance';
import { MapMarker } from 'react-kakao-maps-sdk';

interface StoreDetailMapProps {
  hideButtons?: boolean;
  store?: StoreDetail;
}

/** 외부 링크(메뉴/길찾기) 응답 타입
 *  - menuUrl: 카카오 플레이스 메뉴 페이지
 *  - directionUrlMobile: 네이버 지도앱 딥링크(nmap://...)
 *  - directionUrlDesktop: 네이버 길찾기 웹 링크(m.map.naver.com/...)
 */
type ExternalLinks = {
  menuUrl?: string;
  directionUrlMobile?: string;
  directionUrlDesktop?: string;
} | null;

const StoreDetailMap: React.FC<StoreDetailMapProps> = ({
  hideButtons = false,
  store,
}) => {
  // 메뉴/길찾기 URL 상태
  const [externalLinks, setExternalLinks] = useState<ExternalLinks>(null);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [errorLoadingLinks, setErrorLoadingLinks] = useState(false);

  // 폴백 타이머와 핸들러 정리용 ref (언마운트 시 정리)
  const fallbackTimerRef = useRef<number | null>(null);
  const blurHandlerRef = useRef<(() => void) | null>(null);
  const visibilityHandlerRef = useRef<(() => void) | null>(null);

  // API 호출하여 외부 링크 가져오기
  useEffect(() => {
    const fetchExternalLinks = async () => {
      if (!store?.storeId) {
        // store 객체나 storeId가 없을 경우 호출 X
        console.log('store.storeId가 없어 외부 링크 API 호출을 건너뜀:', store);
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
        if (response.data?.isSuccess) {
          // 응답 results: { menuUrl, directionUrlMobile, directionUrlDesktop }
          setExternalLinks(response.data.results);
        } else {
          console.error('외부 링크 가져오기 실패:', response.data?.message);
          setErrorLoadingLinks(true);
          setExternalLinks(null);
        }
      } catch (err) {
        console.error('외부 링크를 불러오는데 실패:', err);
        setErrorLoadingLinks(true);
        setExternalLinks(null);
      } finally {
        setLoadingLinks(false);
      }
    };

    fetchExternalLinks();

    // 언마운트 시 등록 핸들러/타이머 정리
    return () => {
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (blurHandlerRef.current) {
        window.removeEventListener('blur', blurHandlerRef.current);
        blurHandlerRef.current = null;
      }
      if (visibilityHandlerRef.current) {
        document.removeEventListener('visibilitychange', visibilityHandlerRef.current);
        visibilityHandlerRef.current = null;
      }
    };
  }, [store?.storeId]);

  if (!store) return null;

  const center = { lat: store.latitude, lng: store.longitude };

  // 안전하게 웹 URL 정규화 (프로토콜 없으면 https 붙임)
  const normalizeWebUrl = (url: string) => {
    if (!url) return url;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  // 메뉴 보러가기 (카카오 플레이스 메뉴)
  const handleViewMenu = () => {
    if (externalLinks?.menuUrl) {
      console.log('메뉴 URL로 이동:', externalLinks.menuUrl);
      window.open(externalLinks.menuUrl, '_blank', 'noopener');
    } else {
      console.warn('메뉴 보러가기 URL을 찾을 수 없습니다.');
    }
  };

  // 길찾기 (네이버 지도 앱 우선 → 미설치/실패 시 웹으로 폴백)
  const handleFindWay = () => {
    const mobileLink = externalLinks?.directionUrlMobile;   // nmap://...
    const desktopLinkRaw = externalLinks?.directionUrlDesktop; // m.map.naver.com/...
    if (!mobileLink || !desktopLinkRaw) {
      console.warn('길찾기 URL을 찾을 수 없습니다.');
      return;
    }

    const desktopLink = normalizeWebUrl(desktopLinkRaw);
    const userAgent = navigator.userAgent || '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    if (isMobile) {
      /** 모바일 동작 흐름
       *  1) 먼저 nmap:// 스킴으로 네이버 지도 앱 호출 시도
       *  2) 일정 시간(예: 800ms) 안에 앱으로 전환(=페이지 blur 또는 hidden)이 되면 폴백 취소
       *  3) 전환이 없으면 웹 길찾기 URL로 이동
       */
      // 2-1) 폴백 타이머: 앱이 열리지 않으면 웹으로
      fallbackTimerRef.current = window.setTimeout(() => {
        console.log('앱 실행 감지 실패 → 웹 길찾기로 폴백:', desktopLink);
        window.location.href = desktopLink;
      }, 800);

      // 2-2) 앱 전환 감지: blur(안드로이드/일부 iOS) or visibilitychange(hidden)
      const onBlur = () => {
        if (fallbackTimerRef.current) {
          window.clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
          console.log('앱 전환 감지(blur) → 폴백 취소');
        }
        // 한 번만 필요
        window.removeEventListener('blur', onBlur);
      };
      blurHandlerRef.current = onBlur;
      window.addEventListener('blur', onBlur, { once: true });

      const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && fallbackTimerRef.current) {
          window.clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
          console.log('앱 전환 감지(visibility hidden) → 폴백 취소');
          document.removeEventListener('visibilitychange', onVisibilityChange);
        }
      };
      visibilityHandlerRef.current = onVisibilityChange;
      document.addEventListener('visibilitychange', onVisibilityChange);

      // 1) 앱 열기 시도
      console.log('네이버 지도 앱 호출 시도:', mobileLink);
      // location.href 사용: iOS/안드로이드 기본 동작에 가장 호환
      window.location.href = mobileLink;
    } else {
      // 데스크탑: 바로 웹 길찾기 새 탭
      console.log('데스크탑 환경 → 웹 길찾기로 이동:', desktopLink);
      window.open(desktopLink, '_blank', 'noopener');
    }
  };

  return (
    <div>
      {/* 지도 영역 */}
      <div className="w-full h-[224px]">
        <KakaoMap
          center={center}
          level={3} // 가맹점 상세 페이지의 기본 줌 레벨
        >
          {/* 커스텀 마커 */}
          <MapMarker
            position={center}
            image={{
              src: MARKER,
              size: {
                width: MARKER_IMAGE_SIZE.width,
                height: MARKER_IMAGE_SIZE.height,
              },
              options: {
                offset: {
                  x: MARKER_IMAGE_SIZE.width / 2,
                  y: MARKER_IMAGE_SIZE.height,
                },
              },
            }}
            zIndex={100}
          />
        </KakaoMap>
      </div>

      {/* 버튼 영역 */}
      {!hideButtons && (
        <div className="flex gap-[8px] p-[16px]">
          {/* 메뉴 보러가기 */}
          <button
            onClick={handleViewMenu}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-[#FFF] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
            disabled={loadingLinks || errorLoadingLinks || !externalLinks?.menuUrl}
          >
            <MenuBtn />
            <span className="text-[16px] text-[#616161] leading-[20px] text-center">
              메뉴 보러가기
            </span>
          </button>

          {/* 길 찾기 (네이버 지도) */}
          <button
            onClick={handleFindWay}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-[#FFF] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
            disabled={
              loadingLinks ||
              errorLoadingLinks ||
              !externalLinks?.directionUrlMobile ||
              !externalLinks?.directionUrlDesktop
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
