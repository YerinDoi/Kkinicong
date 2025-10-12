import TopBar from '@/components/common/TopBar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getMyScrapStores } from '@/api/mypage';
import EmptyView from '@/components/Mypage/EmptyView';
import ScrapStoreListSection from '@/components/Mypage/ScrapStoreListSection';
import ScrapMapSection from '@/components/Mypage/ScrapMapSection';

const TOPBAR_AND_MARGIN = 104; // TopBar + 여백
const MAP_MIN_HEIGHT = 234; // 지도 최소 높이

const MyScrapPage = () => {
  const navigate = useNavigate();
  const [scrapStores, setScrapStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [isFixedSheet, setIsFixedSheet] = useState(false);
  const storeListRef = useRef<{ resetToMaxHeight: () => void }>(null);

  // 모바일 대응: --real-vh CSS 변수 설정
  useEffect(() => {
    function setRealHeight() {
      document.documentElement.style.setProperty(
        '--real-vh',
        `${window.innerHeight * 0.01}px`,
      );
    }
    setRealHeight();
    window.addEventListener('resize', setRealHeight);
    return () => window.removeEventListener('resize', setRealHeight);
  }, []);

  useEffect(() => {
    getMyScrapStores()
      .then((res) => {
        const stores = (res.data?.results ?? []).map((store: any) => ({
          ...store,
          isScrapped: true,
        }));
        setScrapStores(stores);
      })
      .finally(() => setLoading(false));
  }, []);

  // sheetHeight 계산 (지도 최소 높이 보장)
  useEffect(() => {
    const realHeight =
      window.innerHeight || document.documentElement.clientHeight || 600;
    setSheetHeight(
      Math.max(realHeight - TOPBAR_AND_MARGIN - MAP_MIN_HEIGHT, 0),
    );
  }, []);

  return (
    <div className="flex flex-col w-full real-vh">
      <TopBar
        title="찜한 가게"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />

      {loading ? null : scrapStores.length === 0 ? (
        <div className="flex flex-1 w-full h-full items-center justify-center bg-bg-gray">
          <EmptyView
            title={'아직 찜한 가게가 없어요'}
            actionText="가게 둘러보기"
            onActionClick={() => navigate('/store-map')}
            actionType="button"
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="bg-[#F3F5ED] font-pretendard text-title-sb-button text-text-gray px-[34px] py-[8px] font-semibold mt-[8px]">
            내가 찜한 가게 수 {scrapStores.length}개
          </div>
          <div
            className="relative w-full"
            style={{
              height: `calc(var(--real-vh, 1vh) * 100 - ${TOPBAR_AND_MARGIN}px)`,
            }}
          >
            <ScrapMapSection
              scrapStores={scrapStores}
              height={
                Math.max(
                  (window.innerHeight ||
                    document.documentElement.clientHeight) -
                    TOPBAR_AND_MARGIN -
                    sheetHeight,
                  MAP_MIN_HEIGHT,
                ) + 17
              }
              onMarkerClick={(store) => {
                setSelectedStore(store);
                setSheetHeight(160);
                setIsFixedSheet(true);
              }}
              onMapClick={() => {
                setSelectedStore(null);
                // 지도 클릭 시 sheetHeight 재계산
                const realHeight =
                  window.innerHeight ||
                  document.documentElement.clientHeight ||
                  600;
                setSheetHeight(
                  Math.max(realHeight - TOPBAR_AND_MARGIN - MAP_MIN_HEIGHT, 0),
                );
                setIsFixedSheet(false);
                storeListRef.current?.resetToMaxHeight();
              }}
            />
            <ScrapStoreListSection
              ref={storeListRef}
              scrapStores={selectedStore ? [selectedStore] : scrapStores}
              sheetHeight={sheetHeight}
              setSheetHeight={setSheetHeight}
              isFixedSheet={isFixedSheet}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyScrapPage;
