import React, { useState, useRef, useEffect } from 'react';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import Icon from '@/assets/icons';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';
import axiosInstance from '@/api/axiosInstance';
import CommentInput from '@/components/Community/CommentInput';
import ReplyItem from '@/components/Community/ReplyItem';

export interface CommentData {
  commentId: number;
  content: string;
  nickname: string | null;
  createdAt: string;
  isModified: boolean;
  isMyComment: boolean;
  isAuthor: boolean;
  isLiked: boolean;
  likeCount: number;
  replyListResponse: CommentData[];
}

interface CommentItemProps {
  data: CommentData;
  postId: number;
  isReply?: boolean;
  onReload?: () => void;
  setIsReplying?: (value: boolean) => void; //답글 작성 중에는 댓글창 없애려고
}

const CommentItem: React.FC<CommentItemProps> = ({
  data,
  isReply = false,
  onReload,
  postId,
  setIsReplying,
}) => {
  const {
    commentId,
    content,
    nickname,
    createdAt,
    isAuthor,
    likeCount,
    replyListResponse,
    isLiked: initialIsLiked,
    isModified,
    isMyComment,
  } = data;
  const { isLoggedIn } = useLoginStatus();
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const token = localStorage.getItem('accessToken');
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const replyInputRef = useRef<HTMLInputElement>(null);

  //좋아요
  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      setIsLoginBottomSheetOpen(true);
      return;
    }

    if (!commentId) {
      console.error('[좋아요 실패] undefined입니다.');
      return;
    }

    try {
      const response = await axiosInstance({
        method: 'post',
        url: `/api/v1/community/comment/${commentId}/like`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isSuccess) {
        setIsLiked(response.data.results.isLiked);
        setLocalLikeCount(response.data.results.likeCount);
      } else {
        console.error('서버 응답 실패:', response.data.message);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
    }
  };

  //답글달기 버튼 클릭

  const handleReplyClick = () => {
    if (!isLoggedIn) {
      setIsLoginBottomSheetOpen(true);
      return;
    }
    setIsReplying?.(true);
    setIsReplyInputOpen(true);
  };

  useEffect(() => {
    if (isReplyInputOpen && replyInputRef.current) {
      replyInputRef.current.focus(); // 모바일 키보드 올라옴
    }
  }, [isReplyInputOpen]);

  //답글전송 함수
  const handleReplySubmit = async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsReplying?.(false);
      const response = await axiosInstance.post(
        `/api/v1/community/post/${postId}/comment/${commentId}/reply`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.isSuccess) {
        setIsReplyInputOpen(false);

        onReload?.(); // 상위에서 댓글 다시 불러오게 하기
      } else {
        console.error('대댓글 등록 실패:', response.data.message);
      }
    } catch (error) {
      console.error('대댓글 등록 에러:', error);
    }
  };

  return (
    <div>
      <div
        className={`${isReply ? 'pl-0 pr-[20px]' : 'px-[20px]'} pb-[12px] border-b-[1.5px] border-[#E6E6E6]`}
      >
        {/* 상단: 프로필 + 닉네임/작성자/시간 + more 아이콘 */}
        <div className="flex justify-between items-center">
          {/* 왼쪽: 프로필 + 텍스트 */}
          <div className="flex gap-[8px] items-center">
            <img
              src={ProfileImg}
              alt="프로필사진"
              className="w-[40px] h-[40px] rounded-full"
            />
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-black body-md-title">
                  {nickname ?? '익명'}
                </span>
                {isAuthor && (
                  <span className="px-[8px] py-[2px] text-body-md-description font-regular rounded-[8px] bg-[#E6E6E6] text-[#616161]">
                    작성자
                  </span>
                )}
                <span className="text-[#919191] text-[12px]">{createdAt}</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 더보기/신고하기 아이콘 */}

          {isMyComment ? (
            <div className="cursor-pointer">
              <Icon name="edit-or-delete" />
            </div>
          ) : (
            <div className="flex gap-[4px] font-regular text-body-md-description cursor-pointer text-[#919191]">
              <Icon name="report" className="w-[16px] h-[14px]" />
              신고하기
            </div>
          )}
        </div>
        <div className="text-[#616161] font-regular text-body-md-title pl-[48px]">
          {content}
        </div>

        {/* 하단: 답글쓰기 + 좋아요 */}
        <div className="flex items-center mt-[12px] pl-[48px] justify-between">
          <div
            onClick={handleReplyClick}
            className={
              isReply
                ? 'hidden'
                : 'cursor-pointer text-black font-regular text-body-md-title '
            }
          >
            답글쓰기
          </div>
          <div
            className={`flex gap-[4px] text-title-sb-button items-center font-bold font-semibold ${
              isLiked ? 'text-main-color' : 'text-[#C3C3C3]'
            }`}
          >
            <button onClick={handleLikeClick} className="cursor-pointer">
              <Icon
                name={isLiked ? 'heart-filled' : 'heart'}
                className="w-[16px]"
              />
            </button>
            {localLikeCount}
          </div>
        </div>
      </div>

      {/* 대댓글 렌더링 */}
      {!isReply && replyListResponse?.length > 0 && (
        <div className="mt-[12px] flex flex-col gap-[12px] ">
          {replyListResponse.map((reply) => (
            <ReplyItem
              key={reply.commentId}
              data={reply}
              postId={postId}
              onReload={onReload}
            />
          ))}
        </div>
      )}

      {isReplyInputOpen && (
        <CommentInput
          onSubmit={handleReplySubmit}
          placeholder="답글을 남겨보세요"
        />
      )}

      <LoginRequiredBottomSheet
        isOpen={isLoginBottomSheetOpen}
        onClose={() => setIsLoginBottomSheetOpen(false)}
      />
    </div>
  );
};

export default CommentItem;
