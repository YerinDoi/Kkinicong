import React from 'react';
import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import Icon from '@/assets/icons';

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
  } = data;

  return (
    <div
      className={`w-full py-3 border-b border-[#EDEDED] ${
        isReply ? 'pl-[48px]' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        {/* 왼쪽: 프로필 + 닉네임/작성자/시간 */}
        <div className="flex gap-[8px]">
          <img src={ProfileImg} className="w-[40px] h-[40px] rounded-full" />
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[4px]">
              <span className="text-black body-md-title">
                {nickname ?? '익명'}
              </span>
              {isAuthor && (
                <span className="px-[4px] py-[2px] text-[10px] rounded-sm bg-[#EDEDED] text-[#6B7280]">
                  작성자
                </span>
              )}
              <span className="text-gray-400 text-[12px]">{createdAt}</span>
            </div>
            <div className="text-black text-[14px] leading-[20px]">
              {content}
            </div>
          </div>
        </div>

        {/* 오른쪽: more 아이콘 */}
        <div className="cursor-pointer">
          <Icon name="more" />
        </div>
      </div>

      {/* 하단: 답글쓰기 + 좋아요 */}
      <div className="flex items-center mt-[8px] gap-[12px] pl-[48px] text-[#6B7280] text-[13px]">
        {!isReply && <div className="cursor-pointer">답글쓰기</div>}
        <div className="flex items-center gap-[4px] cursor-pointer">
          <Icon name="heart" />
          <span>{likeCount}</span>
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
    </div>
  );
};

export default CommentItem;
