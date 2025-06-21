import TopBar from '@/components/common/TopBar';
import { useState } from 'react';
import regionData from '@/constants/region';

function MyNeighborhoodPage() {
  const [input, setInput] = useState('');
  const [dongList, setDongList] = useState<
    { name: string; lat: number; lng: number }[] | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const [city, district] = value.trim().split(/\s+/); // 여기서만 trim
    console.log('입력된 city:', city);
    console.log('입력된 district:', district);
    console.log('regionData[city]:', regionData[city]);
    console.log('regionData[city][district]:', regionData[city]?.[district]);

    if (city && district) {
      const list = regionData[city]?.[district] ?? null;
      setDongList(list);
    } else {
      setDongList(null);
    }
  };

  return (
    <div className="flex flex-col h-full gap-[32px] font-pretendard">
      <div className="flex flex-col gap-[24px] px-[15px]">
        <TopBar
          title="즐겨찾는 지역"
          paddingX="0"
          rightType="custom"
          customRightElement={
            <button
              onClick={() => alert('건너뛰기')}
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
        <div className="text-sm text-[#616161]  font-normal">
          현재는 <span className="text-[#029F64]">인천 지역</span>만 제공되며,{' '}
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

        {dongList ? (
          <ul className="border border-[#616161] mt-[20px] bg-[#F4F6F8] max-h-[170px] overflow-y-auto rounded-[12px] text-[#616161] text-xs font-normal">
            {dongList.map((dong) => (
              <li
                key={dong.name}
                className="px-[12px] py-[8px] h-[34px] text-xs cursor-pointer hover:bg-[#E0E0E0]"
                onClick={() => {
                  const [city, district] = input.trim().split(/\s+/);
                  setInput(`${city} ${district} ${dong.name}`);
                  setDongList(null);
                }}
              >
                {`${input.trim().split(/\s+/)[0]} ${input.trim().split(/\s+/)[1]} ${dong.name}`}
              </li>
            ))}
          </ul>
        ) : input.trim().split(/\s+/).length === 2 &&
          !input.trim().split(/\s+/)[2] ? (
          <p className="mt-[12px] h-[24px] text-[#FF6452] text-sm font-normal">
            *해당하는 지역이 없어요
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default MyNeighborhoodPage;
