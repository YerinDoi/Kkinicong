import React from 'react';

interface LikePost {
  communityPostId: number;
  category: string;
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
  return (
    <div className="px-[16px] py-[12px] border-b-[1.5px] border-[#E6E6E6]">
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <span className="text-[12px] text-[#919191] bg-[#F4F6F8] px-[8px] py-[2px] rounded-[4px]">
            {like.category}
          </span>
          <span className="text-[12px] text-[#919191]">{like.createdAt}</span>
        </div>
        <h3 className="font-medium text-[16px] text-[#1A1A1A]">
          {like.titlePreview}
        </h3>
        <p className="text-[14px] text-[#616161] line-clamp-2">
          {like.contentPreview}
        </p>
        <div className="flex items-center gap-[16px] text-[12px] text-[#919191]">
          <span>댓글 {like.commentCount}</span>
          <span>좋아요 {like.likeCount}</span>
          <span>조회 {like.viewCount}</span>
        </div>
      </div>
    </div>
  );
};

export default MyLikePost;
