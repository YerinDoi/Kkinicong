import { useEffect } from 'react';
import MyLikePost from '@/components/Mypage/MyLikePost';
import EmptyView from './EmptyView';
import { useNavigate } from 'react-router-dom';

interface MyCommunityPostListProps {
  posts: any[];
  onEmptyChange?: (isEmpty: boolean) => void;
  hasNextPage?: boolean;
  loaderRef?: React.RefObject<HTMLDivElement>;
  loading?: boolean;
  chip?: string;
}

const MyCommunityPostList = ({
  posts = [],
  onEmptyChange,
  hasNextPage,
  loaderRef,
  loading,
  chip,
}: MyCommunityPostListProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (onEmptyChange) onEmptyChange(posts.length === 0 && !loading);
  }, [posts, loading, onEmptyChange]);

  return (
    <div
      className={`flex flex-col flex-1 ${posts.length === 0 && !loading ? '' : 'mt-[16px]'}`}
    >
      {posts.length === 0 && !loading ? (
        <div className="flex flex-1 w-full items-center justify-center bg-[#F4F6F8] relative">
          <div style={{ position: 'relative', top: '-36px' }}>
            <EmptyView
              title={'아직 작성한 글이 없어요\n당신의 첫 이야기를 들려주세요'}
              actionText="커뮤니티로 이동해볼까요?"
              onActionClick={() => navigate('/community')}
              actionType="link"
            />
          </div>
        </div>
      ) : (
        <>
          {posts.map((post: any) => (
            <MyLikePost
              key={post.communityPostId}
              like={{
                communityPostId: post.communityPostId,
                titlePreview: post.titlePreview,
                contentPreview: post.contentPreview,
                thumbnailUrl: post.thumbnailUrl ?? null,
                imageCount: post.imageCount ?? 0,
                createdAt: post.createdAt,
                commentCount: post.commentCount,
                likeCount: post.likeCount,
                viewCount: post.viewCount,
                nickname: post.nickname ?? null,
              }}
            />
          ))}
          {hasNextPage && <div ref={loaderRef} className="mt-[16px]" />}
        </>
      )}
    </div>
  );
};

export default MyCommunityPostList;
