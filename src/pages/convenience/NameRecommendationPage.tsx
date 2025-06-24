import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import TopBar from '@/components/common/TopBar';
import SearchIcon from '@/assets/icons/system/search.svg'; // 검색 아이콘
import ORadioIcon from '@/assets/icons/system/radioO.svg'; // 라디오 아이콘
import XRadioIcon from '@/assets/icons/system/radioX.svg'; // 라디오 아이콘

export default function NameRecommendationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialKeyword =
    new URLSearchParams(location.search).get('keyword') || '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSearch = async () => {
    // TODO: 제품명 추천 API 연동
    const fakeData = [
      '동아 포카리스웨트 620ML',
      '동아 포카리스웨트 PET 1.5L',
      '동아 포카리스웨트 245ML 캔',
    ];
    setSuggestions(fakeData); // 임시 데이터
  };

  useEffect(() => {
    if (keyword) handleSearch();
  }, []);

  return (
    <>
      <TopBar title="제품명 추천" />

      <div className="h-screen px-5 py-4 bg-white flex flex-col">
        <label className="text-title-sb-button font-semibold mb-3">
          제품명
        </label>
        <div className="flex px-4 py-4 border border-[#C3C3C3] rounded-[12px]">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="등록할 제품명을 입력해주세요"
            className="flex-1 outline-none text-[#616161] text-body-md-title 
                     placeholder:text-[#919191] placeholder:text-body-md-description"
          />
          <button onClick={handleSearch}>
            <img src={SearchIcon} alt="검색" className="w-5 h-5" />
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-6">
            <p className="mb-7 text-title-sb-button font-semibold">
              ‘{keyword}’ 관련 정확한 상품명은 다음과 같아요
            </p>
            <ul className="flex flex-col gap-5 ">
              {suggestions.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between cursor-pointer text-body-md-title font-regular"
                  onClick={() => setSelected(item)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={selected === item ? ORadioIcon : XRadioIcon}
                      alt="라디오버튼"
                      className="w-4 h-4"
                    />
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => {
            if (selected) {
              navigate('/convenience/add', {
                state: { selectedProductName: selected },
              });
            }
          }}
          className={`mt-auto mb-6 py-3 rounded-lg font-semibold text-white ${
            selected ? 'bg-[#65CE58]' : 'bg-[#E6E6E6]'
          }`}
          disabled={!selected}
        >
          확인
        </button>
      </div>
    </>
  );
}
