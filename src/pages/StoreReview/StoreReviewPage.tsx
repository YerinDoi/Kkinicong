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

const StoreReviewPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, address, category, mainTag } = location.state ?? {};

  // 입력 값 상태 관리
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const mappedTags = selectedTags.map((tag) => tagMap[tag]).filter(Boolean);

  if (!storeId) {
    return <div>가게 정보를 찾을 수 없습니다.</div>;
  }

  const handleSubmitReview = async () => {
    try {
      await axios.post(`/api/v1/${storeId}/review`, {
        rating,
        tag: mappedTags,
        content: comment,
      });

      alert('리뷰가 등록되었습니다!');
      navigate(-1); // 이전 페이지로 이동
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
          <UploadImage />
          <CheckBox />
          <button
            onClick={handleSubmitReview}
            className="bg-[#65CE58] text-white font-semibold text-base px-[16px] py-[12px] rounded-[8px] mt-[24px]"
          >
            리뷰 등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreReviewPage;
