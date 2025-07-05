import StoreList from '@/components/StoreSearch/StoreList';
import useBottomSheet from '@/hooks/useBottomSheet';
import React from 'react';

interface ScrapStoreListSectionProps {
  scrapStores: any[];
  sheetHeight: number;
  setSheetHeight: (h: number) => void;
}

const ScrapStoreListSection = ({
  scrapStores,
  setSheetHeight,
}: ScrapStoreListSectionProps) => {
  // 바텀시트 커스텀 훅 사용
  const headerHeight = 11 + 40 + 12 + 40 + 11;
  const {
    sheetHeight: localSheetHeight,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    isDraggingRef,
  } = useBottomSheet(headerHeight, 303);

  // 바텀시트 높이 변경 시 부모에도 반영
  React.useEffect(() => {
    setSheetHeight(localSheetHeight);
  }, [localSheetHeight, setSheetHeight]);

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg z-[50] flex flex-col"
      style={{
        height: localSheetHeight,
        transition: isDraggingRef.current ? 'none' : 'height 0.3s ease-out',
        boxShadow: '0px -13px 12px 0px rgba(0, 0, 0, 0.10)',
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="touch-none flex justify-center items-center py-2 cursor-grab active:cursor-grabbing flex-shrink-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-[85px] h-[4px] rounded-md bg-[#D9D9D9]" />
      </div>

      {/* 찜한 가게 목록 */}
      <div className="flex flex-col overflow-hidden flex-grow px-[20px] mt-[12px]">
        <div className="h-full overflow-y-auto scrollbar-hide flex-grow pb-[20px]">
          <StoreList stores={scrapStores} />
        </div>
      </div>
    </div>
  );
};

export default ScrapStoreListSection;
