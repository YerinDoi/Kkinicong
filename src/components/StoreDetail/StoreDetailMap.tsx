import KakaoMap, {
  MARKER,
  MARKER_IMAGE_SIZE,
} from '@/components/common/KakaoMap';
import { StoreDetail } from '@/types/store';
import { useState, useEffect } from 'react';
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

/** 유틸: 프로토콜 없으면 https 붙이기 (m.map.naver.com/... 처럼 올 때 대비) */
const normalizeWebUrl = (url: string) =>
  !url ? url : /^https?:\/\//i.test(url) ? url : `https://${url}`;

/** 플랫폼 판별 */
const isIOS = () =>
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod/i.test(navigator.userAgent);

const isAndroid = () =>
  typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/** iOS: 숨은 iframe으로 앱 호출 → 전환 감지 안 되면 웹 폴백
 * - 사파리가 nmap:// 를 현재 탭에서 직접 열려다 실패하며 JS 실행을 끊는 케이스 방지
 * - iframe을 쓰면 현재 탭은 유지 → 타이머/visibility 감지가 안정적으로 동작
 */
function openAppIOSWithFallback(appUrl: string, webUrl: string, timeoutMs = 800) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = appUrl;

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    document.removeEventListener('visibilitychange', onHidden);
    window.removeEventListener('pagehide', onHidden as any);
    window.removeEventListener('blur', onHidden);
    if (iframe.parentNode) document.body.removeChild(iframe);
    clearTimeout(timer);
  };

  const onHidden = () => {
    // 앱으로 전환된 것으로 판단 → 폴백 취소
    if (document.visibilityState === 'hidden' || (document as any).hidden) {
      console.log('[nav] iOS: app switch detected → cancel fallback');
      cleanup();
    }
  };

  // 여러 신호를 함께 감지 (브라우저/OS/인앱 편차 커버)
  document.addEventListener('visibilitychange', onHidden);
  window.addEventListener('pagehide', onHidden as any, { once: true });
  window.addEventListener('blur', onHidden, { once: true });

  const timer = window.setTimeout(() => {
    // 앱 미설치/실패 → 웹 폴백
    console.log('[nav] iOS: fallback to web →', webUrl);
    window.location.href = webUrl;
    cleanup();
  }, timeoutMs);

  document.body.appendChild(iframe);
}

/** Android: intent:// 사용 (설치 O → 앱, 설치 X → S.browser_fallback_url 로 자동 폴백)
 * - dlat/dlng/dname 기준으로 네이버 길찾기 인텐트 생성
 * - 제공받은 mobileUrl(nmap://)로 변환해도 되지만, 좌표로 만드는 방식이 간단·안정적
 */
function openAppAndroidIntent(webUrl: string, dlat: number, dlng: number, dname?: string) {
  const q = new URLSearchParams();
  q.set('dlat', String(dlat));
  q.set('dlng', String(dlng));
  if (dname) q.set('dname', dname);

  const intentUrl =
    `intent://route/public?${q.toString()}` +
    `#Intent;scheme=nmap;package=com.nhn.android.nmap;` +
    `S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;

  console.log('[nav] Android intent →', intentUrl);
  window.location.href = intentUrl;
}

/** 공용: 네이버 길찾기 열기 (앱 우선 → 웹 폴백) */
function openNaverDirections(opts: {
  mobileUrl: string;      // nmap://...
  desktopUrl: string;     // m.map.naver.com/... or https://...
  dlat: number;
  dlng: number;
  dname?: string;
  timeoutMs?: number;     // iOS 폴백 지연 (기본 800ms)
}) {
  const { mobileUrl, desktopUrl, dlat, dlng, dname, timeoutMs = 800 } = opts;
  const webUrl = normalizeWebUrl(desktopUrl);

  if (isAndroid()) {
    // ✅ Android 최적 경로: intent가 설치/미설치를 모두 처리
    openAppAndroidIntent(webUrl, dlat, dlng, dname);
    return;
  }

  if (isIOS()) {
    // ✅ iOS 안정 경로: 숨은 iframe + 타이머 폴백
    console.log('[nav] iOS: try app via hidden iframe →', mobileUrl);
    openAppIOSWithFallback(mobileUrl, webUrl, timeoutMs);
    return;
  }

  // ✅ 데스크탑/기타: 바로 웹
  console.log('[nav] Desktop/Other → open web:', webUrl);
  window.open(webUrl, '_blank', 'noopener');
}

const StoreDetailMap: React.FC<StoreDetailMapProps> = ({
  hideButtons = false,
  store,
}) => {
  // 메뉴/길찾기 URL 상태
  const [externalLinks, setExternalLinks] = useState<ExternalLinks>(null);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [errorLoadingLinks, setErrorLoadingLinks] = useState(false);

  // 외부 링크 가져오기
  useEffect(() => {
    const fetchExternalLinks = async () => {
      if (!store?.storeId) {
        console.log('[links] skip: no storeId', store);
        setLoadingLinks(false);
        return;
      }
      try {
        setLoadingLinks(true);
        setErrorLoadingLinks(false);
        console.log('[links] fetch start →', store.storeId);

        const response = await axiosInstance.get(
          `/api/v1/store/${store.storeId}/external-links`,
        );

        console.log('[links] response:', response.data);
        if (response.data?.isSuccess) {
          // results: { menuUrl, directionUrlMobile, directionUrlDesktop }
          setExternalLinks(response.data.results);
        } else {
          console.error('[links] API isSuccess=false:', response.data?.message);
          setErrorLoadingLinks(true);
          setExternalLinks(null);
        }
      } catch (err) {
        console.error('[links] fetch error:', err);
        setErrorLoadingLinks(true);
        setExternalLinks(null);
      } finally {
        setLoadingLinks(false);
      }
    };

    fetchExternalLinks();
  }, [store?.storeId]);

  if (!store) return null;

  const center = { lat: store.latitude, lng: store.longitude };

  // 메뉴 보러가기 (카카오 플레이스 메뉴)
  const handleViewMenu = () => {
    if (externalLinks?.menuUrl) {
      console.log('[menu] open:', externalLinks.menuUrl);
      window.open(externalLinks.menuUrl, '_blank', 'noopener');
    } else {
      console.warn('[menu] no menuUrl');
    }
  };

  // 길찾기 (네이버 지도: 앱 우선 → 웹 폴백)
  const handleFindWay = () => {
    const mobile = externalLinks?.directionUrlMobile;   // nmap://...
    const desktop = externalLinks?.directionUrlDesktop; // m.map.naver.com/...
    if (!mobile || !desktop) {
      console.warn('[nav] missing direction urls');
      return;
    }

    openNaverDirections({
      mobileUrl: mobile,
      desktopUrl: desktop,
      dlat: store.latitude,
      dlng: store.longitude,
      dname: (store as any).storeName ?? (store as any).name, // 필드명 프로젝트에 맞춰 조정
      timeoutMs: 800, // 필요시 1000~1200으로 늘려 안정성 확인 가능
    });
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
