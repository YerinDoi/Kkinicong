import TopBar from '@/components/common/TopBar';
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

const StoreReviewPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, address, category, mainTag } = location.state ?? {};

  // 입력 값 상태 관리
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const mappedTags = selectedTags.map((tag) => tagMap[tag]).filter(Boolean);
  const [checked, setChecked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const isSubmitEnabled = rating>0 && checked;

  if (!storeId) {
    return <div>가게 정보를 찾을 수 없습니다.</div>;
  }

  const handleSubmitReview = async () => {
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
      }, 3000);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    }
  };
  return (
    <div>
      <div className="flex flex-col w-full mt-[11px] mb-[29px] gap-[12px] font-pretendard">
        <TopBar title="리뷰 쓰기" />
        <StoreInfo
          category={category}
          name={name}
          address={address}
          badgeText={mainTag}
        />

        <div className="px-[16px] flex flex-col gap-[28px]">
          <Rating value={rating} onChange={setRating} />
          <SelectTag selected={selectedTags} onChange={setSelectedTags} />
          <CommentBox value={comment} onChange={setComment} />
          <UploadImage onFileSelect={setImageFile} />
          <CheckBox onCheckChange = {setChecked}/>
          <button
            onClick={handleSubmitReview}
            disabled={!isSubmitEnabled}
            className={`text-white font-semibold text-base px-[16px] py-[12px] rounded-[8px] mt-[24px] ${
              isSubmitEnabled ? 'bg-[#65CE58]' : 'bg-[#E6E6E6] cursor-not-allowed'
            }`}
          >
            공유하기
          </button>
        </div>
        {/*토스트 수정 예정*/}
        {showToast && (
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <ConfirmToast text="리뷰 등록 완료! " />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreReviewPage;
