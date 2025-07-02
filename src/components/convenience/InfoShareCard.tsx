import { useNavigate } from 'react-router-dom';

import cardImg from '@/assets/svgs/convenience/card.svg';
import Button from '@/components/common/Button';

const InfoShareCard = () => {
  const navigate = useNavigate(); // 이동 훅

  const handleShareClick = () => {
    navigate('/convenience/add'); // 이동할 경로로 변경
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <img src={cardImg} alt="카드 이미지" className="w-12" />
      <span className="text-body-bd-title font-semibold">
        어떤 제품이 결제 가능한지 알려주세요! <br />
        여러분의 정보가 누군가의 한 끼를 도울 수 있어요
      </span>
      <Button
        text="정보 공유하기"
        onClick={handleShareClick}
        heightClass="h-[42px]"
        widthClass="w-full"
        bgColorClass="bg-main-color"
        textColorClass="text-white"
        className='border-none'
      />
    </div>
  );
};

export default InfoShareCard;
