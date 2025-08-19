import Header from '@/components/Header';
import StoreInfo from '@/components/StoreReview/StoreInfo';
import Rating from '@/components/StoreReview/Rating';
import SelectTag from '@/components/StoreReview/SelectTag';
import CommentBox from '@/components/StoreReview/CommentBox';
import UploadImage from '@/components/StoreReview/UploadImage';
import CheckBox from '@/components/StoreReview/CheckBox';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useLocation } from 'react-router-dom';
import { tagMap } from '@/constants/tagMap';
import ConfirmToast from '@/components/common/ConfirmToast';
import { createPortal } from 'react-dom';

// 리뷰PR 커밋용 주석 열기
const StoreReviewPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, address, category, mainTag, latitude, longitude } =
    location.state ?? {};

  // 입력 값 상태 관리
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const mappedTags = selectedTags.map((tag) => tagMap[tag]).filter(Boolean);
  const [checked, setChecked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const isSubmitEnabled = rating > 0 && checked;
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!storeId) {
    return <div>가게 정보를 찾을 수 없습니다.</div>;
  }

  const handleSubmitReview = async () => {

    if (isSubmitting) return; // 중복 제출 방지
    setIsSubmitting(true);

    try {
      const reviewRes = await axios.post(`/api/v1/${storeId}/review`, {
        rating,
        tag: mappedTags,
        content: comment,
      });

      const reviewId = reviewRes.data.results.reviewId;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        await axios.post(
          `/api/v1/${storeId}/review/${reviewId}/photo`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );

        console.log('이미지 업로드 완료');
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    }
    finally {
      setIsSubmitting(false);
    }
  };
  // 리뷰PR 커밋용 주석 닫기
  return (
    <div>
      <div className="flex flex-col w-full mb-[29px] gap-[12px] font-pretendard">
        <Header title="리뷰 쓰기" />
        <StoreInfo
          store={{
            storeId: Number(storeId),
            storeName: name,
            storeCategory: category,
            storeAddress: address,
            latitude,
            longitude,
          }}
          badgeText={mainTag}
        />

        <div className="px-[16px] flex flex-col gap-[28px]">
          <Rating value={rating} onChange={setRating} />
          <SelectTag selected={selectedTags} onChange={setSelectedTags} />
          <CommentBox value={comment} onChange={setComment} />
          <UploadImage onFileSelect={setImageFile} />
          <CheckBox onCheckChange={setChecked} />
          <button
            onClick={handleSubmitReview}
            disabled={!isSubmitEnabled}
            className={`text-white font-semibold text-title-sb-button px-[16px] py-[12px] rounded-[8px] mt-[24px] ${
              isSubmitEnabled
                ? 'bg-[#65CE58]'
                : 'bg-[#E6E6E6] cursor-not-allowed'
            }`}
          >
            공유하기
          </button>
        </div>
        {/*토스트 수정 예정*/}
        {showToast &&
          createPortal(
            <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-[9999]">
              <ConfirmToast
                text={['리뷰 작성 완료!', '소중한 의견이 등록되었어요']}
              />
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
};

export default StoreReviewPage;
