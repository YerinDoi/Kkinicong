import { useParams,useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import TopBar from '@/components/common/TopBar';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import ShareIcon from '@/assets/icons/system/share.svg';
import MainTag from '@/components/StoreReview/MainTag';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';
import Icon from '@/assets/icons';
import { useShare } from '@/hooks/useShare';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import CommentItem from '@/components/Community/CommentItem';
import CommentInput from '@/components/Community/CommentInput';
import ReportButton from '@/components/Community/ReportButton';
import EditOrDeleteButton from '@/components/Community/EditOrDeleteButton';
import useCommentActions from '@/hooks/useCommentActions';
import DeleteModal from '@/components/common/DeleteModal';
import ConfirmToast from '@/components/common/ConfirmToast';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';

interface Comment {
  commentId: number;
  content: string;
  nickname: string | null;
  createdAt: string;
  isModified: boolean;
  isMyComment: boolean;
  isLiked: boolean;
  isAuthor: boolean;
  likeCount: number;
  replyListResponse: Comment[];
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
  imageUrls: string[];
  commentListResponse: Comment[];

}

const CommunityPostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isReplying, setIsReplying] = useState(false);
  const [recentCommentId, setRecentCommentId] = useState<number | null>(null);
  // 댓글 수정용 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  //게시글 삭제 토스트
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate();

  const { share } = useShare();
  const { isLoggedIn } = useLoginStatus();
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  

  //게시글 조회
  const fetchPost = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/community/post/${postId}`);
      const result = res.data.results;
      setPost(result);
      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (err) {
      console.error('게시글 조회 실패:', err);
    }
  }, [postId]);
  const { editComment } = useCommentActions(token!, fetchPost);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  useEffect(() => {
  if (post) {
    console.log(' 불러온 post 데이터:', post);
    console.log(' 이미지 URL 목록:', post.imageUrls);
  }
}, [post]);

  //좋아요

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      setPendingPath(`/community/post/${postId}`);
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

  //게시글 수정 -> 글쓰기 연동 후 확인 가능
  const handleEdit = () => {
    navigate(`/community/write?postId=${postId}`);
  };

  //게시글 삭제 
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/v1/community/post/${postId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },);
      setShowDeleteToast(true);
      setTimeout(() => {
      navigate('/community');
    }, 1500);
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };


  //댓글 전송
  const handleCommentSubmit = async (postId: number, content: string) => {
    if (!content.trim()) {
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/api/v1/community/post/${postId}/comment`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newCommentId = response.data.results?.id;
      setRecentCommentId(newCommentId);
      await fetchPost();
      return newCommentId;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  // 댓글 수정/작성 판단
  const handleCommentEditSubmit = async (content: string) => {
  if (isEditing && editingCommentId) {
    const success = await editComment(editingCommentId, content);
    if (success) {
      setIsEditing(false);
      setEditingCommentId(null);
      setEditingContent('');

    }
  } else {
    await handleCommentSubmit(Number(postId), content);
  }
};



  if (!post) return <p>로딩 중...</p>;

  return (
    <div>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.content.slice(0, 50)} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.slice(0, 50)} />
        <meta property="og:image" content={post.imageUrls[0]} />
        <meta property="og:url" content={`${location.origin}/post/${post.communityPostId}`} />
      </Helmet>
      <TopBar

      showBackButton={true}
      onBack={() => navigate('/community')}
    />
      <div className="pb-[16px] px-[20px] flex flex-col gap-[40px] border-b border-[#E6E6E6]">
        <div>
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center text-headline-sb-sub font-semibold justify-between">
              {post.title}
              {post.isMyCommunityPost && (
                <EditOrDeleteButton
                onEdit={handleEdit}
                onDelete={() => setIsDeleteModalOpen(true)}
              />
              )}
              
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
                    {post.isModified && '수정됨 ·'}{post.createdAt} · 조회 {post.viewCount}
                  </span>
                </div>
              </div>
              <img
                src={ShareIcon}
                onClick={() =>
                  share({
                    title: post.title,
                    text: post.content.slice(0, 50),
                    url: `${location.origin}/post/${post.communityPostId}`,
                  })
                }
                className="w-[18px] h-[18px] cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-[20px] flex flex-col gap-[16px]">
            <MainTag rounded="rounded-[8px]" text={post.category} />
            <p className="text-body-md-title font-regular">{post.content}</p>
            {Array.isArray(post.imageUrls) && post.imageUrls.length > 0 && (
              <div className="flex flex-col gap-[16px]">
                {post.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`게시글 이미지 ${idx + 1}`}
                    className="w-full rounded-[8px] object-cover"
                  />
                ))}
              </div>
            )}

            
          </div>
        </div>
        <div className="flex justify-between text-[#C3C3C3] items-center">
          <div
            className={`flex gap-[8px]  text-title-sb-button items-center font-bold ${isLiked ? 'text-main-color' : 'text-[#c3c3c3]'}`}
          >
            <button onClick={handleLikeClick} className="cursor-pointer">
              <Icon name={isLiked ? 'like-filled' : 'like'} />
            </button>
            {likeCount}
          </div>
          {!post.isMyCommunityPost && (
            <ReportButton
              type="post"
              id={postId ? Number(postId) : 0}
              info={{
                nickname: post.nickname ?? '익명',
                content: post.content,
              }}
            />
          )}
        </div>
      </div>

      <LoginRequiredBottomSheet
        isOpen={isLoginBottomSheetOpen}
        onClose={() => setIsLoginBottomSheetOpen(false)}
        pendingPath={pendingPath}
      />

      {/*댓글*/}
      <div className="flex justify-end text-[#C3C3C3] items-center pr-[11px] h-[54px] font-semibold text-title-sb-button">
        <Icon name="comment" className="w-[15px] h-[14px] mr-[4px]" />
        {post.commentCount}
      </div>

      {/* 댓글 목록 렌더링 */}
      {post.commentListResponse.length > 0 ? (
        <div className="flex flex-col ">
          {post.commentListResponse.map((comment, index) => (
            <div key={comment.commentId}>
              <CommentItem
                data={comment}
                postId={Number(postId)}
                onReload={fetchPost}
                setIsReplying={setIsReplying}
                setRecentCommentId={setRecentCommentId}
                recentCommentId={recentCommentId}
                setIsEditing={setIsEditing}
                setEditingCommentId={setEditingCommentId}
                setEditingContent={setEditingContent}
              
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-[20px] flex gap-[8px] items-center text-black text-body-md-title font-regular">
          <img src={ProfileImg} className="w-[40px] h-[40px]" />첫 댓글을
          남겨보세요
        </div>
      )}
      {!isReplying && (
        <div className="px-[20px] mt-[20px] ">
          <CommentInput
            onSubmit={handleCommentEditSubmit}

            defaultValue={editingContent}
             placeholder={
              isLoggedIn
                ? isEditing
                  ? '댓글을 수정하세요'
                  : '댓글을 남겨보세요'
                : '로그인하고 댓글을 남겨보세요'
            }
          />

        </div>
      )}
      <div className="h-[144px]" />
      {isDeleteModalOpen && (
        <DeleteModal
          title="게시글을 정말 삭제하시겠어요?"
          description="삭제된 글은 복구시킬 수 없어요"
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => {
            setIsDeleteModalOpen(false);
            handleDelete();
          }}
        />
      )}
      {showDeleteToast &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <ConfirmToast
              text="게시글 삭제가 완료되었어요"
            />
          </div>,
          document.body,
        )}

    </div>
  );
};

export default CommunityPostDetailPage;
