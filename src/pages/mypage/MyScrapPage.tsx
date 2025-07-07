import TopBar from '@/components/common/TopBar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getMyScrapStores } from '@/api/mypage';
import EmptyView from '@/components/Mypage/EmptyView';
import ScrapStoreListSection from '@/components/Mypage/ScrapStoreListSection';
import ScrapMapSection from '@/components/Mypage/ScrapMapSection';

const TOPBAR_AND_MARGIN = 102; // TopBar + 여백
const MAP_MIN_HEIGHT = 234; // 지도 최소 높이

const getTotalHeight = () =>
  typeof window !== 'undefined' ? window.innerHeight - TOPBAR_AND_MARGIN : 600;

const MyScrapPage = () => {
  const navigate = useNavigate();
  const [scrapStores, setScrapStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalHeight, setTotalHeight] = useState(getTotalHeight());
  const [sheetHeight, setSheetHeight] = useState(
    getTotalHeight() - MAP_MIN_HEIGHT,
  );
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [isFixedSheet, setIsFixedSheet] = useState(false);
  const storeListRef = useRef<{ resetToMaxHeight: () => void }>(null);

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

  // 창 크기 변경 시 totalHeight, sheetHeight 재계산
  useEffect(() => {
    const handleResize = () => {
      const th = getTotalHeight();
      setTotalHeight(th);
      setSheetHeight(Math.max(th - MAP_MIN_HEIGHT, 0));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <TopBar
        title="찜한 가게"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />

      {loading ? null : scrapStores.length === 0 ? (
        <div className="flex flex-1 w-full h-full items-center justify-center bg-[#F4F6F8]">
          <EmptyView
            title={'아직 찜한 가게가 없어요'}
            actionText="가게 둘러보기"
            onActionClick={() => navigate('/store-map')}
            actionType="button"
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="bg-[#F3F5ED] font-pretendard text-title-sb-button text-[#616161] px-[34px] py-[8px] font-medium mt-[8px]">
            내가 찜한 가게 수 {scrapStores.length}개
          </div>
          <div
            className="relative w-full"
            style={{ height: `${totalHeight}px` }}
          >
            <ScrapMapSection
              scrapStores={scrapStores}
              height={Math.max(totalHeight - sheetHeight, MAP_MIN_HEIGHT) + 17}
              onMarkerClick={(store) => {
                setSelectedStore(store);
                setSheetHeight(160);
                setIsFixedSheet(true);
              }}
              onMapClick={() => {
                setSelectedStore(null);
                setSheetHeight(getTotalHeight() - MAP_MIN_HEIGHT);
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
