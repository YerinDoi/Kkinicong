import TopBar from '@/components/common/TopBar';
import GreenButton from '@/components/common/GreenButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Star from '@/components/StoreReview/Star';
import FeedbackBox from '@/components/Mypage/FeedbackBox';
import ConfirmToast from '@/components/common/ConfirmToast';
import axiosInstance from '@/api/axiosInstance';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo as string | undefined;

  const [value, setValue] = useState(0);
  const onChange = (v: number) => setValue(v);

  const [feedback, setFeedback] = useState('');
  const [showToast, setShowToast] = useState(false);
  const userId = localStorage.getItem('nickname');

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/api/v1/feedback', {
        userId,
        rating: value, // 별점
        content: feedback, // 의견 텍스트
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(returnTo ?? '/');
      }, 1500);
    } catch (e) {
      alert('의견 제출에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col w-full h-full pb-[68px]">
      <TopBar
        title="의견 남기기"
        rightType="none"
        onBack={() => (returnTo ? navigate(returnTo) : navigate(-1))}
      />

      <div className="flex flex-col gap-[44px] px-[20px] font-pretendard text-[16px] font-semibold leading-[20px]">
        <div className="border-b border-[#C3C3C3]">
          <div className="flex flex-col h-[44px] justify-between mt-[24px]">
            <p>
              <span className="text-main-color">끼니콩</span>을 이용하면서
            </p>
            <p>느꼈던 점들을 공유해주세요</p>
          </div>

          <p className="text-[14px] font-normal leading-[24px] mt-[16px] mb-[28px]">
            소중한 의견을 통해 더 의미있는 서비스를 만들어나갈게요
          </p>
        </div>

        <div className="flex flex-col px-[8px] gap-[16px] font-semibold">
          <p>얼마나 만족스럽게 사용하고 계신가요?</p>
          <Star value={value} onChange={onChange} />
        </div>

        <FeedbackBox value={feedback} onChange={setFeedback} />
      </div>

      {/* 하단 고정 버튼 */}
      <div className="flex mt-auto justify-center">
        <GreenButton
          text={'제출하기'}
          onClick={handleSubmit}
          disabled={value === 0}
        />
      </div>

      {/* 제출 완료 토스트 */}
      {showToast && (
        <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-[9999]">
          <ConfirmToast text="의견 제출이 완료되었어요" />
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
