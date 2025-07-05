import React from 'react';
import MyLikePost from './MyLikePost';
import EmptyView from './EmptyView';
import ReplyCommentIcon from '@/assets/svgs/community/reply-comment.svg';

interface MyCommentPostListProps {
  commentPosts: any[];
  hasNextPage: boolean;
  loaderRef: React.RefObject<HTMLDivElement>;
  loading?: boolean;
  navigate: (path: string) => void;
}

const MyCommentPostList: React.FC<MyCommentPostListProps> = ({
  commentPosts,
  hasNextPage,
  loaderRef,
  loading = false,
  navigate,
}) => (
  <div className="flex flex-1 flex-col">
    {commentPosts.map((post, idx) => (
      <div key={`${post.postId}-${idx}`}>
        <MyLikePost
          like={{
            communityPostId: post.postId,
            titlePreview: post.titlePreview,
            contentPreview: post.contentPreview,
            thumbnailUrl: null,
            imageCount: 0,
            createdAt: post.createdAt,
            commentCount: post.commentCount,
            likeCount: post.likeCount,
            viewCount: post.viewCount,
            nickname: null,
          }}
          noBorder
        />
        {/* 내가 쓴 댓글 리스트 */}
        {post.myCommentList && post.myCommentList.length > 0 && (
          <div className="flex flex-col">
            {post.myCommentList.map((comment: any, cidx: number) => (
              <div
                key={`${comment.commentId}-${cidx}`}
                className="items-center inline-flex gap-[8px] px-[20px] py-[9px] bg-[#F4F6F8]"
              >
                <img src={ReplyCommentIcon} alt="reply-comment" />
                <span className="flex items-center font-pretendard text-[12px] text-[#616161] font-normal leading-[18px] tracking-[0.012px]">
                  {comment.content}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
    {commentPosts.length === 0 && !loading && (
      <div className="flex flex-1 w-full h-full items-center justify-center bg-[#F4F6F8]">
        <EmptyView
          title={'아직 작성한 댓글이 없어요'}
          actionText="커뮤니티로 이동해볼까요?"
          onActionClick={() => navigate('/community')}
          actionType="link"
        />
      </div>
    )}
    {hasNextPage && <div ref={loaderRef}></div>}
  </div>
);

export default MyCommentPostList;
