import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { createConveniencePost } from '@/api/convenience';
import { toServerCategory, toServerBrand } from '@/utils/convenienceMapper';

import ButtonGroup from '@/components/convenience/ButtonGroup';
import TopBar from '@/components/common/TopBar';
import SelectableButton from '@/components/convenience/SelectableButton';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';

import SparkleIcon from '@/assets/svgs/convenience/sparkle.svg';
import { useLoginStatus } from '@/hooks/useLoginStatus';

export default function AddConveniencePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { selectedProductName?: string };

  const { isLoggedIn } = useLoginStatus();
  const [isLoginSheetOpen, setLoginSheetOpen] = useState(false);

  // 로그인 안 했으면 바텀시트 띄우기
  useEffect(() => {
    if (isLoggedIn === null) return; // 아직 판단 중
    if (isLoggedIn === false) {
      setLoginSheetOpen(true);
    }
  }, [isLoggedIn]);

  // const [productName, setProductName] = useState(''); // 제품명
  const [productName, setProductName] = useState(
    state?.selectedProductName || '',
  );

  const [selectedBrand, setBrand] = useState<string | null>(null); // 선택된 브랜드
  const [selectedCategory, setCategory] = useState<string | null>(null); // 선택된 카테고리
  const [description, setDescription] = useState(''); // 상세설명
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // 결제 가능 여부

  const isFormValid =
    productName && selectedBrand && selectedCategory && isAvailable !== null;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const brand = toServerBrand(selectedBrand!);
    const category = toServerCategory(selectedCategory!);

    if (!brand || !category) {
      alert('브랜드 또는 카테고리가 올바르지 않습니다');
      return;
    }

    try {
      const convenienceId = await createConveniencePost({
        name: productName,
        brand,
        category,
        description,
        isAvailable: isAvailable!,
      });

      console.log('등록 성공!', convenienceId);
      alert('제품 정보를 성공적으로 공유했어요!');
      navigate('/convenience');
    } catch (err) {
      console.error('등록 실패:', err);
      alert('등록 중 오류가 발생했어요 😢');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="편의점 정보 등록" />

      <div className="px-5 py-4 flex flex-col gap-7 flex-1">
        <div className="flex flex-col gap-3">
          <label className="text-title-sb-button font-semibold">제품명</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="등록할 제품명을 입력해주세요"
            className="w-full p-4 border border-[#C3C3C3] rounded-[12px] text-[#616161] text-body-md-title 
                     placeholder:text-[#919191] placeholder:text-body-md-description"
          />
          <button
            className="flex items-center text-[#029F64] text-body-md-title font-regular"
            onClick={() => navigate('/convenience/name-recommendation')}
          >
            <img
              src={SparkleIcon}
              alt="sparkle icon"
              className="w-[18px] h-[18px] inline mr-1"
            />
            정확한 제품명 추천받기
          </button>
        </div>

        <div>
          <p className="text-title-sb-button font-semibold mb-3">편의점 이름</p>
          <ButtonGroup
            options={['GS25', 'CU', '세븐일레븐', '이마트24', '미니스톱']}
            selected={selectedBrand || ''}
            onChange={(value) => setBrand(value)}
            className="overflow-x-auto"
          />
        </div>

        <div>
          <p className="text-title-sb-button font-semibold mb-3">카테고리</p>
          <ButtonGroup
            options={['식사류', '간식류', '음료', '과일류', '기타']}
            selected={selectedCategory || ''}
            onChange={(value) => setCategory(value)}
            className="overflow-x-auto"
          />
        </div>

        <div>
          <div className="flex mb-3 justify-between items-center text-title-sb-button font-semibold">
            <label>상세설명 (선택)</label>
            <span className="text-right text-[#919191]">
              {description.length}/300
            </span>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            placeholder="ex) 직원이 알려줬어요"
            className="w-full p-4 border border-[#C3C3C3] rounded-[12px] text-[#616161] text-body-md-title 
                     placeholder:text-[#919191] placeholder:text-body-md-description"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <SelectableButton
            label="결제 가능"
            isSelected={isAvailable === true}
            onClick={() => setIsAvailable(true)}
            className="w-full py-3 text-title-sb-button font-semibold"
          />
          <SelectableButton
            label="결제 불가능"
            isSelected={isAvailable === false}
            onClick={() => setIsAvailable(false)}
            className="w-full py-3 text-title-sb-button font-semibold"
          />
        </div>
      </div>

      <button
        className={`mx-4 my-7 py-3 rounded-lg font-semibold text-[#919191] ${
          isFormValid
            ? 'bg-[#65CE58] text-[#FFFFFF]'
            : 'bg-[#E6E6E6] text-[#919191]'
        }`}
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        공유하기
      </button>

      {/* 로그인 필요 바텀시트 */}
      <LoginRequiredBottomSheet
        isOpen={isLoginSheetOpen}
        onClose={() => {
          setLoginSheetOpen(false);
        }}
      />
    </div>
  );
}
