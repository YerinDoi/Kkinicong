import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import TopBar from '@/components/common/TopBar';
import MoreIcon from '@/assets/svgs/common/more-icon.svg';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import ShareIcon from '@/assets/icons/system/share.svg';
import MainTag from '@/components/StoreReview/MainTag';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';
import Icon from '@/assets/icons';
import { useShare } from '@/hooks/useShare';
import EditOrDeleteBottomSheet from '@/components/Community/EditOrDeleteBottomSheet';
import { useLoginStatus } from '@/hooks/useLoginStatus';

interface Comment {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  isMyComment: boolean | null;
}

interface PostDetail {
  communityPostId: number;
  title: string;
  nickname: string | null;
  createdAt: string;
  viewCount: number;
  isModified: boolean;
  category: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean | null;
  isMyCommunityPost: boolean | null;
  commentListResponse: Comment[];
}

const PostDetailHeaderSection = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [isEDBottomSheetOpen, setIsEDBottomSheetOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { share } = useShare();
  const { isLoggedIn } = useLoginStatus();
  const navigate = useNavigate();

  //좋아요

  const handleLikeClick = async () => {
    const token = localStorage.getItem('accessToken');

    if (!isLoggedIn) {
      setIsLoginBottomSheetOpen(true);
      return;
    }

    if (!postId) {
      console.error('[좋아요 실패] postId undefined입니다.');
      return;
    }

    try {
      const response = await axiosInstance({
        method: 'post',
        url: `/api/v1/community/post/${postId}/like`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isSuccess) {
        setIsLiked(response.data.results.isLiked);
        setLikeCount(response.data.results.likeCount);
      } else {
        console.error('서버 응답 실패:', response.data.message);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
    }
  };

  //더보기 바텀시트

  const handleEDClick = async () => {
    setIsEDBottomSheetOpen(true);
  };

  //게시글 수정하기
  const handleEdit = () => {
    // 예: 페이지 이동
    console.log('수정 페이지로 이동!');
    // navigate(`/community/post/${postId}/edit`);
  };

  //게시글 삭제하기
  const handleDelete = async () => {
    if (!postId) return;
    try {
      await axiosInstance.delete(`/api/v1/community/post/${postId}`);
      alert('삭제되었습니다!');
      navigate('/community');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/community/post/${postId}`);

        const result = res.data.results;
        setPost(result);
        setIsLiked(result.isLiked);
        setLikeCount(result.likeCount);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>로딩 중...</p>;

  return (
    <div>
      <TopBar />
      <div className="pb-[16px] px-[20px] flex flex-col gap-[40px] border-b border-[#E6E6E6]">
        <div>
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center text-headline-sb-sub font-semibold justify-between">
              {post.title}
              {/*{post.isMyCommunityPost && (
                작성 부분도 구현 완료되면 더보기버튼 코드 여기에 넣을 예정
              )}*/}
              <img
                src={MoreIcon}
                alt="더보기 버튼"
                className="w-[3px] h-[14.25px] cursor-pointer"
                onClick={handleEDClick}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-[8px] items-center">
                <img
                  src={ProfileImg}
                  alt="프로필사진"
                  className="w-[40px] h-[40px]"
                />
                <div className="flex flex-col gap-[4px]">
                  <span className="text-body-md-title font-regular">
                    {post.nickname ?? '익명'}
                  </span>
                  <span className="flex gap-[2px] text-body-md-description text-[#C3C3C3]">
                    {post.createdAt} · 조회 {post.viewCount}
                  </span>
                </div>
              </div>
              <img
                src={ShareIcon}
                onClick={share}
                className="w-[18px] h-[18px] cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-[20px] flex flex-col gap-[16px]">
            <MainTag rounded="rounded-[8px]" text={post.category} />
            <p className="text-body-md-title font-regular">{post.content}</p>
          </div>
        </div>
        <div className="flex gap-[8px] text-[#C3C3C3] text-title-sb-button items-center font-bold ">
          <button onClick={handleLikeClick} className="cursor-pointer">
            <Icon name={isLiked ? 'like-filled' : 'like'} />
          </button>
          {likeCount}
        </div>
      </div>

      <h3 className="text-lg font-semibold">댓글</h3>
      <ul className="mt-2 space-y-2">
        {(post.commentListResponse ?? []).map((c) => (
          <li key={c.commentId} className="border p-2 rounded">
            <p className="text-sm text-gray-700">{c.content}</p>
            <p className="text-xs text-gray-500">
              {c.author} • {c.createdAt}
              {c.isMyComment && ' (내 댓글)'}
            </p>
          </li>
        ))}
      </ul>

      <LoginRequiredBottomSheet
        isOpen={isLoginBottomSheetOpen}
        onClose={() => setIsLoginBottomSheetOpen(false)}
      />
      <EditOrDeleteBottomSheet
        isOpen={isEDBottomSheetOpen}
        onClose={() => setIsEDBottomSheetOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PostDetailHeaderSection;
