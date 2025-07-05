import React from 'react';
import CommentIcon from '@/assets/svgs/common/comment.svg';
import { useNavigate } from 'react-router-dom';

interface LikePost {
  communityPostId: number;
  titlePreview: string;
  contentPreview: string;
  thumbnailUrl: string | null;
  imageCount: number;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  nickname: string | null;
}

interface MyLikePostProps {
  like: LikePost;
}

const MyLikePost: React.FC<MyLikePostProps> = ({ like }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col gap-[12px] px-[20px] py-[19px] self-stretch border-b-[1.5px] border-[#E6E6E6] cursor-pointer"
      onClick={() => navigate(`/community/post/${like.communityPostId}`)}
    >
      <div className="flex flex-col gap-[8px]">
        <span className="font-pretendard text-title-sb-button font-medium text-[16px] text-[#212121]">
          {like.titlePreview}
        </span>
        <span className="font-pretendard text-body-md-title font-normal text-[#C3C3C3]">
          {like.contentPreview}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] font-pretendard text-body-md-title font-normal text-[#C3C3C3]">
          <span>좋아요 {like.likeCount}</span>
          <span>·</span>
          <span>{like.createdAt}</span>
          <span>·</span>
          <span>조회 {like.viewCount}</span>
        </div>

        <div className="flex items-center gap-[4px]">
          <img src={CommentIcon} className="w-[15px] h-[14px]" />
          <span className="font-pretendard text-[16px] font-normal text-[#C3C3C3] tracking-[0.016px]">
            {like.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyLikePost;
