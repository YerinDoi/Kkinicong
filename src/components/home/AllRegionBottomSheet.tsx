import { useNavigate } from "react-router-dom";

interface RegionBottomSheetProps {
    onClose: () => void;
  }
  
  export default function RegionBottomSheet({
    onClose,
  }: RegionBottomSheetProps) {
    const navigate = useNavigate();

    return (
      <div className="flex flex-col w-full py-[16px]">
  
        {/* 헤더 */}
        <div className="text-center text-body-md-title font-regular pb-[8px]">
          현재 서비스 중인 지역
        </div>
  
        {/* 지역 내용 전체 wrapper */}
        <div className="flex flex-col pt-[12px] gap-[8px] border-t-2 border-bg-gray">
  
          {/* 좌우 영역 */}
          <div className="flex pb-[24px]">
  
            {/* 왼쪽 */}
            <div className="flex flex-col px-[24px] gap-[6px] flex-1 text-title-sb-button">
              <p className="font-semibold py-[10px]">서울특별시</p>
              <p className="font-semibold py-[10px]">인천광역시</p>
              <p className="font-semibold py-[10px]">대구광역시</p>
              <p className="font-semibold py-[10px]">부산광역시</p>
            </div>
  
            {/* 오른쪽 */}
            <div className="flex flex-col px-[24px] gap-[6px] flex-1">
  
              <div className="flex flex-col py-[8px] gap-[8px]">
                <p className="font-semibold py-[2px] text-title-sb-button">경기도</p>
                <div className="flex flex-col gap-[4px] text-[14px] text-body-md-title">
                  <p className="font-regular">부천시</p>
                  <p className="font-regular">수원시</p>
                  <p className="font-regular">성남시</p>
                  <p className="font-regular">고양시</p>
                  <p className="font-regular">용인시</p>
                </div>
              </div>
  
              <div className="flex flex-col py-[8px] gap-[8px]">
                <p className="font-semibold py-[2px] text-title-sb-button">경상북도</p>
                <div className="flex flex-col text-[14px] text-body-md-title">
                  <p className="font-regular">경산시</p>
                </div>
              </div>
  
            </div>
  
          </div>
        </div>
  
        {/* 하단 버튼 */}
        <div className="grid grid-cols-2 border-t-[2px] border-bg-gray text-[16px]">
          <button
            className="py-[12px] font-bold"
            onClick={onClose}
          >
            취소
          </button>
  
          <button 
            className="py-[12px] font-bold"
            onClick={() => navigate("/feedback")}
          >
            지역 요청하기
          </button>
        </div>
      </div>
    );
  }