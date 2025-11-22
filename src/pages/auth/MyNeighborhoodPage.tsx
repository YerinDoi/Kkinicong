import TopBar from '@/components/common/TopBar';
import { useState } from 'react';
import regionDataRaw from '@/data/regionData.json';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import GreenButton from '@/components/common/GreenButton';

const regionData = (
  (regionDataRaw as any).default ?? regionDataRaw
) as Record<string, Record<string, { name: string; lat: number; lng: number }[]>>;

function MyNeighborhoodPage() {
  const [input, setInput] = useState('');
  const [isLocationRegistered, setIsLocationRegistered] = useState(false);

  const navigate = useNavigate();
  const [dongList, setDongList] = useState<
    { name: string; lat: number; lng: number }[] | null
  >(null);

  const words = input.trim().split(/\s+/);
  const [city, district, selectedDong] = words;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('regionDataRaw', regionDataRaw);

    const value = e.target.value;
    setInput(value);

    const words = value.trim().split(/\s+/);
    const [newCity, newDistrict, newDong] = words;

    if (newCity && newDistrict && !newDong) {
      // 기존 방식: 시 + 군/구 입력 시 동 리스트 추출
      const list = regionData[newCity]?.[newDistrict] ?? null;
      if (list) {
        const enrichedList = list.map((dong) => ({
          ...dong,
          city: newCity,
          district: newDistrict,
        }));
        setDongList(enrichedList);
      } else {
        setDongList(null);
      }
    } else if (words.length === 1 && words[0] !== '') {
      // 동 이름만 입력된 경우: 전체 탐색
      const searchWord = words[0];
      const matched = [];

      for (const city in regionData) {
        for (const district in regionData[city]) {
          for (const dong of regionData[city][district]) {
            if (dong.name.includes(searchWord)) {
              matched.push({
                ...dong,
                city,
                district,
              });
            }
          }
        }
      }

      if (matched.length > 0) {
        setDongList(matched);
      } else {
        setDongList(null);
      }
    } else {
      setDongList(null);
    }
  };



  const handleDongSelect = async (dong: {
    name: string;
    lat: number;
    lng: number;
    city: string;
    district: string;
  }) => {
    console.log('handleDongSelect 받은 dong:', dong);
    const fullInput = `${dong.city} ${dong.district} ${dong.name}`;
    setInput(fullInput);
    setDongList(null);
    console.log(' 선택된 지역:', fullInput);
    console.log(' 위도:', dong.lat);
    console.log(' 경도:', dong.lng);

    try {
      const response = await axiosInstance.post(
        'https://kkinikong.store/api/v1/user/place',
        {
          latitude: dong.lat,
          longitude: dong.lng,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      if (response.data.isSuccess) {
        console.log('즐겨찾는 지역이 등록되었어요!');
        setIsLocationRegistered(true);
      } else {
        alert('등록 실패: ' + response.data.message);
        setIsLocationRegistered(false);
      }
    } catch (err) {
      console.error('API 오류:', err);
      alert('서버 요청 중 오류가 발생했어요.');
      setIsLocationRegistered(false);
    }
  };

  return (
    
    <div className="flex flex-col h-full gap-[32px] font-pretendard pb-[68px]">
      <div className="flex flex-col gap-[24px] px-[15px]">
        <TopBar
          title="즐겨찾는 지역"
          paddingX="0"
          rightType="custom"
          customRightElement={
            <button
              onClick={() => navigate('/')}
              className="text-body-md-description font-regular"
            >
              건너뛰기
            </button>
          }
        />
        <div className="text-title-sb-button font-semibold h-[44px] justify-between">
          <p>자주 가는 지역을</p>
          <p className="text-main-color">즐겨찾는 지역으로 등록할 수 있어요</p>
        </div>
        <div className="text-body-md-title text-text-gray font-regular">
          자주 가는 지역을 설정하면 매번 GPS를 허용하지 않아도
          <br /> 빠르게 확인할 수 있어요.
        </div>
        <div className="text-body-md-title text-text-gray font-regular">
          현재는 <span className="text-sub-color">서울,인천,부천,수원,고양,용인,부산,성남시</span>만 제공되며,
          <br />
          다른 지역은 요청이 많은 순으로 추가될 예정이에요.
          <br />
          등록된 지역은 마이페이지에서 수정 가능해요.
        </div>
      </div>

      <div className="px-[20px] text-main-gray text-body-md-description font-regular leading-[18px] tracking-[0.012px]">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="ex) 백석동"
          className="border border-sub-gray text-black px-[16px] py-[12px] w-full rounded-[12px]"
        />

        {dongList && dongList.length > 0 ? (
          <ul className="border border-text-gray mt-[20px] bg-bg-gray max-h-[170px] overflow-y-auto rounded-[12px] text-text-gray text-body-md-description font-regular">
 
            {dongList.map((dong: any) => (
              <li
                key={`${dong.city}-${dong.district}-${dong.name}-${dong.lat}`}
                className="px-[12px] py-[8px] h-[34px] cursor-pointer hover:bg-[#E0E0E0]"
                onClick={() => {
                  console.log('클릭한 dong:', dong);
                  console.log('dong 전체 정보:', JSON.stringify(dong));
                  handleDongSelect({
                    name: dong.name,
                    lat: dong.lat,
                    lng: dong.lng,
                    city: dong.city,
                    district: dong.district,
                  });
                }}
              >
                {`${dong.city} ${dong.district} ${dong.name}`}
              </li>
            ))}

          </ul>
        ) : city && district && !selectedDong ? (
          <p className="mt-[12px] h-[24px] text-warning text-body-md-title font-regular">
            *해당하는 지역이 없어요
          </p>
        ) : null}
      </div>
      <div className="flex mt-auto justify-center">
        <GreenButton
          text="끼니콩 시작하기"
          onClick={() => navigate('/')}
          disabled={!isLocationRegistered}
        />
      </div>
    </div>
  );
}

export default MyNeighborhoodPage;
