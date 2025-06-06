import cardImg from '@/assets/svgs/convenience/card.svg';
import Button from '@/components/common/Button';

const InfoShareCard = () => {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <img src={cardImg} alt="카드 이미지" className="w-12" />
      <span className="text-body-bd-title font-semibold">
        어떤 제품이 결제 가능한지 알려주세요! <br />
        여러분의 정보가 누군가의 한 끼를 도울 수 있어요.
      </span>
      {/* <button className="bg-main-color text-white rounded-lg px-4 py-3">
        제품 정보 공유하기
      </button> */}
      <Button
        text="제품 정보 공유하기"
        onClick={() => {}}
        heightClass="h-[48px]"
        widthClass="w-full"
        bgColorClass="bg-main-color"
        textColorClass="text-white"
      />
    </div>
  );
};

export default InfoShareCard;
