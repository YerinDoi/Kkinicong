import TopBar from '@/components/common/TopBar';
import { useState } from 'react';
import regionData from '@/constants/regionData';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import GreenButton from '@/components/common/GreenButton';

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
    const value = e.target.value;
    setInput(value);

    const [newCity, newDistrict] = value.trim().split(/\s+/);
    if (newCity && newDistrict) {
      const list = regionData[newCity]?.[newDistrict] ?? null;
      setDongList(list);
    } else {
      setDongList(null);
    }
  };

  const handleDongSelect = async (dong: {
    name: string;
    lat: number;
    lng: number;
  }) => {
    const fullInput = `${city} ${district} ${dong.name}`;
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
      setIsLocationRegistered(true);
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
              className="text-xs font-normal"
            >
              건너뛰기
            </button>
          }
        />
        <div className="text-base font-semibold h-[44px] justify-between">
          <p>자주 가는 지역을</p>
          <p className="text-[#65CE58]">즐겨찾는 지역으로 등록할 수 있어요</p>
        </div>
        <div className="text-sm text-[#616161] font-normal">
          자주 가는 지역을 설정하면 매번 GPS를 허용하지 않아도
          <br /> 빠르게 확인할 수 있어요.
        </div>
        <div className="text-sm text-[#616161] font-normal">
          현재는 <span className="text-[#029F64]">인천 지역</span>만 제공되며,
          <br />
          다른 지역은 요청이 많은 순으로 추가될 예정이에요.
          <br />
          등록된 지역은 마이페이지에서 수정 가능해요.
        </div>
      </div>

      <div className="px-[20px] text-[#919191] text-xs font-normal leading-[18px] tracking-[0.012px]">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="ex) 인천광역시 서구"
          className="border border-[#C3C3C3] text-black px-[16px] py-[12px] w-full rounded-[12px]"
        />

        {dongList && dongList.length > 0 ? (
          <ul className="border border-[#616161] mt-[20px] bg-[#F4F6F8] max-h-[170px] overflow-y-auto rounded-[12px] text-[#616161] text-xs font-normal">
            {dongList.map((dong) => (
              <li
                key={dong.name}
                className="px-[12px] py-[8px] h-[34px] text-xs cursor-pointer hover:bg-[#E0E0E0]"
                onClick={() => handleDongSelect(dong)}
              >
                {`${city} ${district} ${dong.name}`}
              </li>
            ))}
          </ul>
        ) : city && district && !selectedDong ? (
          <p className="mt-[12px] h-[24px] text-[#FF6452] text-sm font-normal">
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
