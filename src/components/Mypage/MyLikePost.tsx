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
  noBorder?: boolean;
}

const MyLikePost: React.FC<MyLikePostProps> = ({ like, noBorder }) => {
  const navigate = useNavigate();
  const hasThumbnail = !!like.thumbnailUrl;

  return (
    <div
      className={
        'flex flex-col gap-[12px] px-[20px] py-[12px] self-stretch cursor-pointer' +
        (noBorder ? '' : ' border-b-[1.5px] border-disabled')
      }
      onClick={() => navigate(`/community/post/${like.communityPostId}`)}
    >
    
      <div className={`flex ${hasThumbnail ? 'flex-row justify-between' : 'flex-col gap-[12px]'}`}>
      <div className="flex flex-col gap-[8px]">
        <span className="font-pretendard text-title-sb-button font-semibold text-[16px] text-[#212121]">
          {like.titlePreview}
        </span>
        <span className="font-pretendard text-body-md-title font-normal text-sub-gray">
          {like.contentPreview}
        </span>
      </div>
        {/* 오른쪽: 썸네일 */}
        {hasThumbnail && (
            <div className="relative w-[90px] h-[88px] rounded-[8px] overflow-hidden shrink-0 ml-[12px]">
            <img
                src={like.thumbnailUrl ?? undefined}
                alt="thumbnail"
                className="w-full h-full object-cover rounded-[8px]"
            />
            {(like.imageCount ?? 0) > 1 && (
                <div className="flex justify-center absolute top-0 left-0 w-[29.667px] h-[29.333px] bg-[rgba(68,60,54,0.94)] items-center font-pretendard font-normal tracking-[0.014px] text-center text-white text-[12px] px-[7px] py-[2px] rounded-[8px]">
                {like.imageCount}
                </div>
            )}
            </div>
        )}
      </div>


      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] font-pretendard text-body-md-title font-medium text-sub-gray">
          <span>좋아요 {like.likeCount}</span>
          <span>·</span>
          <span>{like.createdAt}</span>
          <span>·</span>
          <span>조회 {like.viewCount}</span>
        </div>

        <div className="flex items-center gap-[4px]">
          <img src={CommentIcon} className="w-[15px] h-[14px]" />
          <span className="font-pretendard text-[16px] font-medium text-sub-gray tracking-[0.016px]">
            {like.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyLikePost;
