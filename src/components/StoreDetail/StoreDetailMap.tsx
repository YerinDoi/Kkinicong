// StoreDetailMap.tsx
import KakaoMap, {
  MARKER,
  MARKER_IMAGE_SIZE,
} from '@/components/common/KakaoMap';
import { StoreDetail } from '@/types/store';
import { useMemo, useState, useEffect } from 'react';
import MenuBtn from '@/assets/svgs/detail/menu-btn.svg?react';
import NavigationBtn from '@/assets/svgs/detail/navigation-btn.svg?react';
import axiosInstance from '@/api/axiosInstance';
import { MapMarker } from 'react-kakao-maps-sdk';

interface StoreDetailMapProps {
  hideButtons?: boolean;
  store?: StoreDetail;
}

type ExternalLinks = {
  menuUrl?: string;
  directionUrlDesktop?: string;
} | null;

const UA = typeof navigator !== 'undefined' ? navigator.userAgent : '';
const IS_IOS = /iPhone|iPad|iPod/i.test(UA);
const IS_ANDROID = /Android/i.test(UA);
const IS_MOBILE = IS_IOS || IS_ANDROID;

const normalizeWebUrl = (raw: string) => {
  if (!raw) return '';
  const t = raw.trim();
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    return new URL(withProto).toString();
  } catch {
    if (import.meta.env.DEV) console.debug('[nav] invalid desktop url:', raw);
    return '';
  }
};

const toCoord = (v: unknown) => {
  const n = typeof v === 'string' ? Number(v) : (v as number);
  return Number.isFinite(n) ? Number(n.toFixed(6)) : NaN;
};

const isSafeScheme = (s: string) =>
  !!s && !/\s/.test(s) && /^nmap:\/\/.+/i.test(s) && s.length < 2048;

/* ========================= Android 앱 오픈(강화) ========================= */
/** Android: nmap:// → 200ms → intent:// → 1.2s → 웹 폴백 (전환 감지 시 타이머 정리) */
function openAppAndroid(appUrl: string, intentUrl: string, webUrl: string) {
  let finished = false;

  const clearAll = () => {
    if (finished) return;
    finished = true;
    clearTimeout(t1);
    clearTimeout(t2);
    window.removeEventListener('blur', onHidden);
    document.removeEventListener('visibilitychange', onHidden);
  };

  const onHidden = () => clearAll();

  window.addEventListener('blur', onHidden);
  document.addEventListener('visibilitychange', onHidden);

  window.location.href = appUrl;

  const t1 = window.setTimeout(() => {
    if (!finished) window.location.href = intentUrl;
  }, 200);

  const t2 = window.setTimeout(() => {
    if (!finished) {
      window.location.href = webUrl;
      clearAll();
    }
  }, 1200);
}

/* ============================ 공용 오픈 진입점 ============================ */
/**
 * - 데스크탑: 항상 웹 길찾기 새 탭
 * - 모바일: 앱 우선(설치 O → 앱 / 설치 X → 웹), 앱 다녀와도 웹으로 튀지 않음
 * - iOS: a[href="nmap://..."] 실제 탭(사용자 제스처)로 실행 + 백그라운드 전환 감지로 타이머 취소
 */
function buildNaverDeepLinks(opts: {
  desktopUrl: string;
  dlat: number | string;
  dlng: number | string;
  dname?: string;
  appname?: string;
}) {
  const { desktopUrl, dlat, dlng, dname, appname = 'kkinicong' } = opts;

  const lat = toCoord(dlat);
  const lng = toCoord(dlng);
  const webUrl = normalizeWebUrl(desktopUrl);

  const q = new URLSearchParams();
  if (Number.isFinite(lat)) q.set('dlat', String(lat));
  if (Number.isFinite(lng)) q.set('dlng', String(lng));
  if (dname) q.set('dname', dname);
  q.set('appname', appname);

  const appUrl = `nmap://route/public?${q.toString()}`;
  const intentUrl =
    `intent://route/public?${q.toString()}` +
    `#Intent;scheme=nmap;package=com.nhn.android.nmap;` +
    `S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;

  return { lat, lng, appUrl, intentUrl, webUrl };
}

const StoreDetailMap: React.FC<StoreDetailMapProps> = ({
  hideButtons = false,
  store,
}) => {
  const [externalLinks, setExternalLinks] = useState<ExternalLinks>(null);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [errorLoadingLinks, setErrorLoadingLinks] = useState(false);

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
          if (import.meta.env.DEV)
            console.debug('[links] isSuccess=false:', res.data?.message);
          setErrorLoadingLinks(true);
          setExternalLinks(null);
        }
      } catch (e) {
        if (import.meta.env.DEV)
          console.debug('[links] fetch error:', String(e));
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

  /** 데스크탑: 항상 웹 길찾기 (새 탭) */
  const handleFindWayDesktop = () => {
    const desktop = externalLinks?.directionUrlDesktop;
    if (!desktop) return;
    const webUrl = normalizeWebUrl(desktop);
    if (webUrl) window.open(webUrl, '_blank', 'noopener');
  };

  /** Android: 앱 우선(앱→인텐트→웹) */
  const handleFindWayAndroid = () => {
    const desktop = externalLinks?.directionUrlDesktop;
    if (!desktop) return;

    const { lat, lng, appUrl, intentUrl, webUrl } = buildNaverDeepLinks({
      desktopUrl: desktop,
      dlat: store.latitude,
      dlng: store.longitude,
      dname:
        (store as any).storeName ?? (store as any).name ?? (store as any).title,
      appname: 'kkinicong',
    });

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      !webUrl ||
      !isSafeScheme(appUrl)
    ) {
      // 좌표/URL 이상하면 그냥 웹
      if (webUrl) window.open(webUrl, '_blank', 'noopener');
      return;
    }

    openAppAndroid(appUrl, intentUrl, webUrl);
  };

  /**
   * iOS: 버튼을 <a href="nmap://...">로 렌더링하여
   * 진짜 사용자 탭 네비게이션으로 앱 호출
   * onClick에선 전환 감지/폴백 타이머만 설정(기본 네비게이션 방해 X)
   */
  const iosDeepLinks = useMemo(() => {
    if (!externalLinks?.directionUrlDesktop) return null;
    const { appUrl, webUrl } = buildNaverDeepLinks({
      desktopUrl: externalLinks.directionUrlDesktop,
      dlat: store.latitude,
      dlng: store.longitude,
      dname:
        (store as any).storeName ?? (store as any).name ?? (store as any).title,
      appname: 'kkinicong',
    });
    if (!isSafeScheme(appUrl)) return null;
    return { appUrl, webUrl };
  }, [
    externalLinks?.directionUrlDesktop,
    store?.latitude,
    store?.longitude,
    store,
  ]);

  const onClickIOSAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!iosDeepLinks) return;
    const { webUrl } = iosDeepLinks;

    // 전환 감지되면 타이머 취소 → 돌아와도 웹 안 뜸
    let finished = false;
    const cleanup = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', onHidden as any);
      window.removeEventListener('blur', onHidden);
    };
    const onHidden = () => cleanup();

    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', onHidden as any);
    window.addEventListener('blur', onHidden);

    // 기본 동작(앱 링크 이동)은 막지 않는다 (preventDefault 금지)
    const timer = window.setTimeout(() => {
      // 앱 미설치로 전환이 없으면 웹 폴백
      if (!finished && webUrl) {
        window.location.href = webUrl;
      }
      cleanup();
    }, 1200);
  };

  // debug overlay removed

  return (
    <div>
      {/* 지도 */}
      <div className="w-full h-[224px]">
        <KakaoMap
          center={{ lat: store.latitude, lng: store.longitude }}
          level={3}
        >
          <MapMarker
            position={{ lat: store.latitude, lng: store.longitude }}
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

      {/* 버튼 */}
      {!hideButtons && (
        <div className="flex gap-[8px] p-[16px]">
          {/* 메뉴 보러가기 */}
          <button
            onClick={handleViewMenu}
            className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-white hover:bg-[var(--BG,#F3F5ED)] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
            disabled={
              loadingLinks || errorLoadingLinks || !externalLinks?.menuUrl
            }
          >
            <MenuBtn />
            <span className="text-[16px] text-[#616161] leading-[20px] text-center">
              메뉴 보러가기
            </span>
          </button>

          {/* 길찾기 */}
          {/* 데스크탑 → 버튼(웹 새 탭) / Android → 버튼(JS) / iOS → <a href="nmap://..."> */}
          {!IS_MOBILE && (
            <button
              onClick={handleFindWayDesktop}
              className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-white hover:bg-[var(--BG,#F3F5ED)] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
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
          )}

          {IS_ANDROID && (
            <button
              onClick={handleFindWayAndroid}
              className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-white hover:bg-[var(--BG,#F3F5ED)] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
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
          )}

          {IS_IOS && iosDeepLinks && (
            <a
              href={iosDeepLinks.appUrl} // 진짜 링크로 열기(사용자 제스처)
              onClick={onClickIOSAnchor} // 폴백 타이머/전환 감지
              className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-white hover:bg-[var(--BG,#F3F5ED)] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
              style={{ textDecoration: 'none' }}
            >
              <NavigationBtn />
              <span className="text-[16px] text-[#616161] leading-[20px] text-center">
                길 찾기
              </span>
            </a>
          )}

          {IS_IOS && !iosDeepLinks && (
            <button
              onClick={handleFindWayDesktop}
              className="flex-1 flex items-center justify-center gap-[12px] h-[44px] bg-white hover:bg-[var(--BG,#F3F5ED)] border-[1.5px] border-[#C3C3C3] rounded-[12px] font-medium px-[20px] py-[12px]"
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
          )}
        </div>
      )}

      {/* debug overlay removed */}
    </div>
  );
};

export default StoreDetailMap;
