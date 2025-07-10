import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  fetchConvenienceDetail,
  submitPostFeedback,
  deleteConveniencePost,
} from '@/api/convenience';
import { fromServerBrand, fromServerCategory } from '@/utils/convenienceMapper';

import TopBar from '@/components/common/TopBar';
import DeleteConvenience from '@/components/convenience/DeleteConvenience';
import FeedbackButtons from '@/components/convenience/FeedbackButtons';

import ShareIcon from '@/assets/svgs/convenience/share.svg?react';
import ProfileIcon from '@/assets/svgs/convenience/profile.svg';
import DeleteIcon from '@/assets/svgs/convenience/delete.svg';

interface PostDetail {
  userNickname: string;
  isMine: boolean;
  createTime: string;
  name: string;
  isAvailable: boolean;
  brand: string;
  category: string;
  description: string;
  CorrectCount: number;
  IncorrectCount: number;
  userSelection: boolean | null; // 사용자 선택값 (true / false / null)
}

export default function ConvenienceDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      try {
        const data = await fetchConvenienceDetail(Number(postId));
        setPost(data);
      } catch (err) {
        console.error('상세 정보 조회 실패', err);
      }
    };

    loadPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!postId) return;
    try {
      await deleteConveniencePost(Number(postId));
      setModalOpen(false);
      navigate('/convenience');
    } catch (err) {
      console.error('삭제 실패', err);
      alert('삭제에 실패했어요. 다시 시도해주세요.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: '끼니콩 추천 편의점!',
      text: '이 제품 정말 좋아요 😋',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('공유 성공');
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않아요 ');
    }
  };

  const handleVote = async (isCorrect: boolean) => {
    if (!post || !postId) return;

    const prev = { ...post };

    const isSame =
      (isCorrect === true && post.userSelection === true) ||
      (isCorrect === false && post.userSelection === false);

    // 낙관적 UI 업데이트
    let correct = post.CorrectCount;
    let incorrect = post.IncorrectCount;

    if (isSame) {
      // 같은 값을 다시 누른 경우: 취소 처리
      if (isCorrect) correct -= 1;
      else incorrect -= 1;
    } else {
      // 다른 값으로 변경한 경우: 이전 값 제거, 새 값 추가
      if (post.userSelection === true) correct -= 1;
      if (post.userSelection === false) incorrect -= 1;
      if (isCorrect) correct += 1;
      else incorrect += 1;
    }

    setPost({
      ...post,
      CorrectCount: correct,
      IncorrectCount: incorrect,
      userSelection: isSame ? null : isCorrect,
    });


    // 2. 서버에 요청
    try {
      const res = await submitPostFeedback(Number(postId), isCorrect);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              CorrectCount: res.correctCount,
              IncorrectCount: res.incorrectCount,
              userSelection: res.userSelection ?? null,
            }
          : null,
      );
    } catch (error) {
      console.error('피드백 요청 실패', error);
      setPost(prev); // 3. 실패 시 롤백
    }
  };

  if (!post) return null;

  return (
    <>
      {/* 상단바 */}
      <TopBar
        rightType="custom"
        customRightElement={
          <button onClick={handleShare}>
            <ShareIcon className="w-[18px] h-5" />
          </button>
        }
      />

      <div className="min-h-screen px-4">
        {/* 작성 정보, 삭제버튼 */}
        <div className="flex items-center gap-1 mb-3 mt-[12px]">
          <img
            src={ProfileIcon}
            alt="작성자"
            className="inline-block w-9 h-9"
          />
          <div className="flex items-baseline gap-1">
            <span className="text-body-md-title font-regular">
              {post.userNickname}
            </span>
            <span className="text-body-md-description font-regular text-[#919191]">
              {post.createTime}
            </span>
          </div>
          {post.isMine && (
            <button className="ml-auto" onClick={() => setModalOpen(true)}>
              <img src={DeleteIcon} alt="삭제" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 상품명 및 상태 */}
        <div className="flex items-center py-2">
          <span className="text-headline-sb-main font-semibold">
            {post.name}
          </span>
          {/* <span className="text-[#65CE58] text-body-md-title font-regular ml-3">
            {post.isAvailable ? '결제가능' : '결제불가능'}
          </span> */}
          
          <span className={`text-body-md-title font-regular ml-3 ${
              post.isAvailable ? 'text-[#65CE58]' : 'text-red-500'
            }`}
          >
            {post.isAvailable ? '결제가능' : '결제불가능'}
          </span>
        </div>

        {/* 카테고리 및 브랜드 pill */}
        <div className="flex gap-2 mt-2">
          <div className="border-[#919191] border-[1.5px] leading-[1] rounded-[12px] px-5 py-1 bg-[#F4F6F8]">
            {fromServerCategory(post.category)}
          </div>
          <div className="border-[#919191] border-[1.5px] leading-[1] rounded-[12px] px-5 py-1 bg-[#F4F6F8]">
            {fromServerBrand(post.brand)}
          </div>
        </div>

        {/* 상세설명 */}
        <div className="mt-5">
          <div className="flex mb-3 justify-between items-center text-title-sb-button font-semibold">
            <label>상세설명</label>
          </div>

          <p className="min-h-20 px-4 py-3 border border-[#C3C3C3] rounded-[12px] text-[#616161] text-body-md-title">
            {post.description}
          </p>
        </div>

        {/* 구분선 */}
        <div className="my-7 h-[1.5px] bg-[#E6E6E6]" />

        {/* 피드백 버튼 */}
        <FeedbackButtons
          isMine={post.isMine}
          correctCount={post.CorrectCount}
          incorrectCount={post.IncorrectCount}
          userSelection={post.userSelection}
          onVote={handleVote}
        />
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteConvenience
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
