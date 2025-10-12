import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProductNameRecommendations } from '@/api/convenience';

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

  // const handleSearch = async () => {
  //   // TODO: 제품명 추천 API 연동
  //   const fakeData = [
  //     '동아 포카리스웨트 620ML',
  //     '동아 포카리스웨트 PET 1.5L',
  //     '동아 포카리스웨트 245ML 캔',
  //   ];
  //   setSuggestions(fakeData); // 임시 데이터
  // };

  // 제품명 추천 API 호출 함수
  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      const data = await fetchProductNameRecommendations(keyword);
      setSuggestions(data);
    } catch (err) {
      console.error('제품명 추천 실패:', err);
      alert('추천 결과를 불러오는 데 실패했어요 😢');
    }
  };

  useEffect(() => {
    if (keyword) handleSearch();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <TopBar title="제품명 추천" />

      <div className="px-5 py-4 bg-white flex flex-col">
        <label className="text-title-sb-button font-semibold mb-3">
          제품명
        </label>
        <div className="flex px-4 py-4 mb-10 border border-sub-gray rounded-[12px]">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ex) 서울우유 500ML"
            className="flex-1 outline-none text-text-gray text-body-md-title
                     placeholder:text-main-gray placeholder:text-body-md-description"
          />
          <button onClick={handleSearch}>
            <img src={SearchIcon} alt="검색" className="w-5 h-5" />
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt6">
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
      </div>

      <button
        onClick={() => {
          if (selected) {
            navigate('/convenience/add', {
              state: { selectedProductName: selected },
            });
          }
        }}
        className={`mt-auto mb-6 mx-4 py-3 rounded-[12px] font-semibold text-white ${
          selected ? 'bg-main-color' : 'bg-disabled'
        }`}
        disabled={!selected}
      >
        확인
      </button>
    </div>
  );
}
