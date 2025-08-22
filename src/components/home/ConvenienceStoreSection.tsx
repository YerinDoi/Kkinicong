import Card from '@/assets/svgs/convenience/card.svg';
import { useNavigate } from 'react-router-dom';
import StoreChipCarousel from './ChipCarousel';
import { useState, useEffect } from 'react';
import Forward from '@/assets/icons/system/forward.svg';
import axiosInstance from '@/api/axiosInstance';

const brandMap: Record<string, string> = {
  GS25: 'GS25',
  CU: 'CU',
  세븐일레븐: 'SEVEN_ELEVEN',
  이마트24: 'EMART_24',
  미니스톱: 'MINI_STOP',
};

function ConvenienceStoreSection() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('GS25');
  const [items, setItems] = useState<any[]>([]);
  const [noResult, setNoResult] = useState(false);

  const handleClick = () => {
    navigate('/convenience', { state: { brand: selectedBrand } });
  }; //정보 공유하기

  const fetchBrandList = async (brand: string) => {
    try {
      const apiBrand = brandMap[brand];
      const res = await axiosInstance.get('/api/v1/convenience/list', {
        params: { brand: apiBrand },
      });
      const result = res.data?.results;
      if (result === 'NO_RESULT') {
        setNoResult(true);
        return [];
      }
      const content = result?.content;
      console.log('[응답리스트]', content);

      if (!Array.isArray(content)) return [];
      setNoResult(false);
      const sliced = content.slice(0, 3);

      return sliced;
    } catch (err) {
      console.error('API 실패:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchBrandList(selectedBrand).then((data) => {
      setItems(data);
    });
  }, [selectedBrand]);

  return (
    <div className="px-[20px] pb-[24px] flex flex-col gap-[20px] border-b-8 border-[#F4F6F8]">
      <div className="flex flex-col gap-[16px]">
        <button className="flex flex-col gap-[8px] " onClick={handleClick}>
          <img src={Card} className="w-[57px] h-[40px]" />
          <p className="text-black text-title-sb-button h-[44px] flex flex-col justify-between font-semibold text-left">
            <span>편의점 구매 가능 리스트</span>
            <span>실시간 사용자 후기로 확인해보세요!</span>
          </p>
        </button>
        <div className="-mx-[20px] overflow-x-auto scrollbar-hide">
          <div className="flex gap-[10px] px-[20px] pr-[20px] w-max">
            <StoreChipCarousel
              selected={selectedBrand}
              onSelect={setSelectedBrand}
            />
          </div>
        </div>
      </div>
      <div className="py-[16px] pl-[20px] pr-[19px] rounded-[10px] flex flex-col gap-[20px] shadow-custom min-h-[160px]">
        <div className="flex justify-between">
          <span className="text-title-sb-button font-semibold leading-[20px] text-[#212121]">
            {selectedBrand}
          </span>

          <button
            className="text-[#919191] text-body-md-description font-regular flex gap-[8px] items-center"
            onClick={handleClick}
          >
            {noResult ? '정보 공유하기' : '전체보기'}
            <img src={Forward} className="w-[7px]" />
          </button>
        </div>
        {noResult ? (
          <div className="mt-[16px] justify-center items-center font-regular flex flex-col gap-[8px]">
            <p className="text-[#919191] text-body-md-title leading-[18px]">
              아직은 공유된 제품 정보가 없어요
            </p>
            <p className="text-[#C3C3C3] text-body-md-description">
              여러분의 결제 경험을 공유해주세요
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-[14px]">
            {items.map((item: any) => (
              <li
                key={item.id}
                onClick={() => navigate(`/convenience/post/${item.id}`)}
                className="flex justify-between items-center cursor-pointer text-body-md-title font-regular text-black"
              >
                <span>{item.name}</span>
                <div
                  className={`w-fit text-[12px] leading-[18px] font-semibold tracking-[0.01em] bg-[#F4F6F8] border-[1px] rounded-[8px] px-3 py-1 ${
                    item.isAvailable
                      ? 'text-[#029F64] border-[#029F64]'
                      : 'text-[#FF6452] border-[#FF6452]'
                  }`}
                >
                  {item.isAvailable ? '결제가능' : '결제불가'}
                </div>
                {/* <span
                  className={
                    item.isAvailable ? 'text-[#029F64] border-[#029F64]'
                    : 'text-[#FF6452] border-[#FF6452]'
                  }
                >
                  {item.isAvailable ? '결제가능' : '결제불가'}
                </span> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ConvenienceStoreSection;
