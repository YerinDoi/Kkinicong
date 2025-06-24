import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchConvenienceDetail,
  submitPostFeedback,
  deleteConveniencePost,
} from '@/api/convenience';

import TopBar from '@/components/common/TopBar';
import DeleteConvenience from '@/components/ConvenienceStore/DeleteConvenience';

// import ShareIcon from '@/assets/svgs/convenience/share.svg';
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
      navigate('/convenience'); // 목록 페이지로 이동
    } catch (err) {
      console.error('삭제 실패', err);
      alert('삭제에 실패했어요. 다시 시도해주세요.');
    }
  };

  const handleVote = async (isCorrect: boolean) => {
    if (!post || !postId) return;

    // 1. Optimistic update
    const prev = { ...post };
    setPost({
      ...post,
      CorrectCount: post.CorrectCount + (isCorrect ? 1 : 0),
      IncorrectCount: post.IncorrectCount + (!isCorrect ? 1 : 0),
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
      <TopBar />

      <div className="min-h-screen px-4">
        {/* 작성 정보, 삭제버튼 */}
        <div className="flex items-center gap-1 mb-3">
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
          <span className="text-[#65CE58] text-body-md-title font-regular ml-3">
            {post.isAvailable ? '결제가능' : '결제불가능'}
          </span>
        </div>

        {/* 카테고리 및 브랜드 pill */}
        <div className="flex gap-2 mt-2">
          <div className="border-[#919191] border-[1.5px] leading-[1] rounded-[12px] px-5 py-1 bg-[#F4F6F8]">
            {post.category}
          </div>
          <div className="border-[#919191] border-[1.5px] leading-[1] rounded-[12px] px-5 py-1 bg-[#F4F6F8]">
            {post.brand}
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
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleVote(true)}
            disabled={post.isMine}
            className={`flex-1 border-[1.5px] rounded-[12px] py-3 text-title-sb-button font-semibold ${
              post.isMine
                ? 'border-[#E0E0E0] text-[#C0C0C0] bg-[#F8F8F8] cursor-not-allowed'
                : 'border-[#C3C3C3] text-[#616161]'
            }`}
          >
            올바른 정보예요
            <span className="ml-2 font-semibold">{post.CorrectCount}</span>
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={post.isMine}
            className={`flex-1 border-[1.5px] rounded-[12px] py-3 text-title-sb-button font-semibold ${
              post.isMine
                ? 'border-[#E0E0E0] text-[#C0C0C0] bg-[#F8F8F8] cursor-not-allowed'
                : 'border-[#C3C3C3] text-[#616161]'
            }`}
          >
            잘못된 정보예요
            <span className="ml-2 text-title-sb-button font-semibold">
              {post.IncorrectCount}
            </span>
          </button>
        </div>

        {/* 피드백 안내 메시지 */}
        {post.isMine && (
          <p className="mt-2 text-center text-[#B0B0B0] text-sm">
            본인이 작성한 글은 피드백할 수 없어요
          </p>
        )}
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
