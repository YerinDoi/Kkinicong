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
 * - menuUrl: 카카오 플레이스 메뉴 페이지
 * - directionUrlDesktop: 네이버 길찾기 웹 (m.map.naver.com/..., 프로토콜 없을 수 있음)
 *   ※ 모바일 앱 링크는 백엔드 걸 안 쓰고, 여기서 좌표로 nmap:///intent://를 직접 생성해 신뢰성 높임
 */
type ExternalLinks = {
  menuUrl?: string;
  directionUrlDesktop?: string;
} | null;

/** 프로토콜 없으면 https 붙이기 */
const normalizeWebUrl = (url: string) =>
  !url ? url : /^https?:\/\//i.test(url) ? url : `https://${url}`;

/** UA 판별 */
const getUA = () =>
  typeof navigator !== 'undefined' ? navigator.userAgent : '';
const isIOS = () => /iPhone|iPad|iPod/i.test(getUA());
const isAndroid = () => /Android/i.test(getUA());

/** iOS: 숨은 iframe으로 nmap:// 호출 → 전환 감지 실패 시 웹 폴백
 * - Safari가 커스텀 스킴을 현재 탭에서 열다 실패하면 JS가 끊기는 문제를 피하기 위함
 */
function openAppIOSWithFallback(appUrl: string, webUrl: string, timeoutMs = 900) {
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
    // 앱 전환(백그라운드) 감지 → 폴백 취소
    if (document.visibilityState === 'hidden' || (document as any).hidden) {
      cleanup();
    }
  };

  document.addEventListener('visibilitychange', onHidden);
  window.addEventListener('pagehide', onHidden as any, { once: true });
  window.addEventListener('blur', onHidden, { once: true });

  const timer = window.setTimeout(() => {
    // 앱 미설치/차단 → 웹 폴백
    window.location.href = webUrl;
    cleanup();
  }, timeoutMs);

  document.body.appendChild(iframe);
}

/** Android: nmap:// → intent:// → (그래도 실패) 웹, 순서로 더 공격적으로 앱 오픈 시도
 * - 많은 기기/브라우저에서 바로 앱이 열리도록 우선 nmap://
 * - 200ms 후 intent:// 재시도 (Chrome 최적)
 * - 1.2s 후에도 전환이 없으면 웹 폴백
 */
function openAppAndroidRobust(appUrl: string, webUrl: string, intentUrl: string) {
  let finished = false;

  const clearAll = () => {
    finished = true;
    clearTimeout(t1);
    clearTimeout(t2);
    window.removeEventListener('blur', onHidden);
    document.removeEventListener('visibilitychange', onHidden);
  };

  const onHidden = () => {
    if (!finished) clearAll(); // 앱 전환 감지되면 타이머 정리
  };

  window.addEventListener('blur', onHidden);
  document.addEventListener('visibilitychange', onHidden);

  // 1) nmap:// 먼저
  window.location.href = appUrl;

  // 2) 잠깐 대기 후 intent:// (Chrome에서 견고)
  const t1 = window.setTimeout(() => {
    if (!finished) window.location.href = intentUrl;
  }, 200);

  // 3) 끝까지 전환 없으면 웹 폴백
  const t2 = window.setTimeout(() => {
    if (!finished) {
      window.location.href = webUrl;
      clearAll();
    }
  }, 1200);
}

/** 네이버 길찾기 오픈 (앱 우선)
 * - 백엔드의 모바일 딥링크 값에 의존하지 않고, 좌표/가게명으로 nmap/intent를 직접 생성
 */
function openNaverDirectionsStrong(opts: {
  desktopUrl: string;  // m.map.naver.com/... or https://...
  dlat: number;
  dlng: number;
  dname?: string;
  timeoutMs?: number;  // iOS 폴백 대기 (기본 900ms)
}) {
  const { desktopUrl, dlat, dlng, dname, timeoutMs = 900 } = opts;
  const webUrl = normalizeWebUrl(desktopUrl);

  const params = new URLSearchParams();
  params.set('dlat', String(dlat));
  params.set('dlng', String(dlng));
  if (dname) params.set('dname', dname);

  // 앱 스킴 (네이버 지도)
  const nmapScheme = `nmap://route/public?${params.toString()}`;

  if (isAndroid()) {
    // Android intent (설치 O→앱, X→S.browser_fallback_url 로 자동 폴백)
    const intentUrl =
      `intent://route/public?${params.toString()}` +
      `#Intent;scheme=nmap;package=com.nhn.android.nmap;` +
      `S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;

    openAppAndroidRobust(nmapScheme, webUrl, intentUrl);
    return;
  }

  if (isIOS()) {
    // iOS는 숨은 iframe + 타이머 폴백이 가장 안정적
    openAppIOSWithFallback(nmapScheme, webUrl, timeoutMs);
    return;
  }

  // 데스크탑/기타: 바로 웹
  window.open(webUrl, '_blank', 'noopener');
}

const StoreDetailMap: React.FC<StoreDetailMapProps> = ({
  hideButtons = false,
  store,
}) => {
  const [externalLinks, setExternalLinks] = useState<ExternalLinks>(null);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [errorLoadingLinks, setErrorLoadingLinks] = useState(false);

  // 외부 링크 가져오기 (menuUrl, directionUrlDesktop)
  useEffect(() => {
    const fetchExternalLinks = async () => {
      if (!store?.storeId) {
        setLoadingLinks(false);
        return;
      }
      try {
        setLoadingLinks(true);
        setErrorLoadingLinks(false);

        const res = await axiosInstance.get(
          `/api/v1/store/${store.storeId}/external-links`,
        );
        if (res.data?.isSuccess) {
          setExternalLinks(res.data.results);
        } else {
          setErrorLoadingLinks(true);
          setExternalLinks(null);
        }
      } catch (e) {
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

  const handleViewMenu = () => {
    if (externalLinks?.menuUrl) {
      window.open(externalLinks.menuUrl, '_blank', 'noopener');
    }
  };

  const handleFindWay = () => {
    const desktop = externalLinks?.directionUrlDesktop; // m.map.naver.com/... (프로토콜 없을 수 있음)
    if (!desktop) return;

    // 프로젝트 필드명에 맞게 가맹점명 보정
    const storeName =
      (store as any).storeName ??
      (store as any).name ??
      (store as any).title ??
      undefined;

    openNaverDirectionsStrong({
      desktopUrl: desktop,
      dlat: store.latitude,
      dlng: store.longitude,
      dname: storeName,
      timeoutMs: 900, // 필요시 1000~1500으로 늘려 안정성 확인
    });
  };

  return (
    <div>
      {/* 지도 영역 */}
      <div className="w-full h-[224px]">
        <KakaoMap center={center} level={3}>
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

          {/* 길 찾기 (네이버 지도: 앱 우선 → 웹 폴백) */}
          <button
            onClick={handleFindWay}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-[#FFF] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
            disabled={
              loadingLinks ||
              errorLoadingLinks ||
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
