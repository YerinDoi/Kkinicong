import { useEffect, useState } from 'react';
import { getMyCommunityPosts } from '@/api/mypage';
import MyLikePost from '@/components/Mypage/MyLikePost';
import EmptyView from './EmptyView';
import { useNavigate } from 'react-router-dom';

interface MyCommunityPostListProps {
  onEmptyChange?: (isEmpty: boolean) => void;
  chip?: string;
}

const MyCommunityPostList = ({
  onEmptyChange,
  chip,
}: MyCommunityPostListProps) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (chip !== '커뮤니티') return;

    setLoading(true);
    getMyCommunityPosts(page, 20)
      .then((res) => {
        setPosts(res.data.results.content);
        setHasNextPage(res.data.results.totalPage > page + 1);
      })
      .finally(() => setLoading(false));
  }, [page, chip]);

  useEffect(() => {
    if (onEmptyChange) onEmptyChange(posts.length === 0 && !loading);
  }, [posts, loading, onEmptyChange]);

  return (
    <div className="flex flex-col flex-1">
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
        posts.map((post: any) => (
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
        ))
      )}
      {hasNextPage && <div>더 불러오기 등 페이지네이션 처리</div>}
    </div>
  );
};

export default MyCommunityPostList;
