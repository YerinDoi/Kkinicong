import React, { useState } from 'react';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import Icon from '@/assets/icons';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import LoginRequiredBottomSheet from '@/components/common/LoginRequiredBottomSheet';
import axiosInstance from '@/api/axiosInstance';

export interface CommentData {
  commentId: number;
  content: string;
  nickname: string | null;
  createdAt: string;
  isModified: boolean;
  isMyComment: boolean;
  isAuthor: boolean;
  likeCount: number;
  replyListResponse: CommentData[];
}

interface CommentItemProps {
  data: CommentData;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ data, isReply = false }) => {
  const {
    commentId,
    content,
    nickname,
    createdAt,
    isAuthor,
    likeCount,
    replyListResponse,
    isModified,
    isMyComment,
  } = data;
  const { isLoggedIn } = useLoginStatus();
  const [isLoginBottomSheetOpen, setIsLoginBottomSheetOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const token = localStorage.getItem('accessToken');
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

  return (
    <div
      className={` pb-[12px] border-b-[1.5px] border-[#E6E6E6] ${
        isReply ? 'pl-[48px]' : 'px-[20px]'
      }`}
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
        <div className="cursor-pointer text-black font-regular text-body-md-title ">
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

      {/* 대댓글 렌더링 */}
      {!isReply && replyListResponse?.length > 0 && (
        <div className="mt-[12px] flex flex-col gap-[12px]">
          {replyListResponse.map((reply) => (
            <CommentItem key={reply.commentId} data={reply} isReply />
          ))}
        </div>
      )}

      <LoginRequiredBottomSheet
        isOpen={isLoginBottomSheetOpen}
        onClose={() => setIsLoginBottomSheetOpen(false)}
      />
    </div>
  );
};

export default CommentItem;
