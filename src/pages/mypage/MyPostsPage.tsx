import TopBar from '@/components/common/TopBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabBar from '@/components/Mypage/TabBar';
import { useEffect, useState } from 'react';
import ChipGroup from '@/components/Mypage/ChipGroup';
import PostItem from '@/components/Community/PostItem';
import MyConveniencePostItem from '@/components/Mypage/MyConveniencePostItem';
import { getMyCommunityPosts, getMyConveniencePosts } from '@/api/mypage';
import EmptyView from '@/components/Mypage/EmptyView';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || '게시글';
  const chip = searchParams.get('chip') || '커뮤니티';

  // 게시글 데이터 상태 (any[]로 타입 지정)
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [conveniencePosts, setConveniencePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 탭/칩 변경 핸들러
  const handleTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab, chip });
  };
  const handleChipChange = (newChip: string) => {
    setSearchParams({ tab, chip: newChip });
  };

  useEffect(() => {
    if (tab !== '게시글') return;
    setLoading(true);
    if (chip === '커뮤니티') {
      getMyCommunityPosts(0, 10)
        .then((res: any) => setCommunityPosts(res.data.results.content))
        .finally(() => setLoading(false));
    } else if (chip === '편의점 게시판') {
      getMyConveniencePosts(0, 10)
        .then((res: any) => setConveniencePosts(res.data.results.content))
        .finally(() => setLoading(false));
    }
  }, [tab, chip]);

  return (
    <div className="flex flex-col w-full h-full pt-[11px] gap-[16px]">
      <TopBar
        title="내가 쓴 글"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />

      <TabBar
        value={tab}
        onChange={handleTabChange}
        tabs={['게시글', '댓글']}
      />

      {tab === '게시글' && (
        <ChipGroup
          options={['커뮤니티', '편의점 게시판']}
          selected={chip}
          onChange={handleChipChange}
        />
      )}

      {/* 게시글 탭 - 커뮤니티 */}
      {tab === '게시글' && chip === '커뮤니티' && (
        <div className="">
          {communityPosts.map((post, idx) => (
            <PostItem key={post.communityPostId ?? idx} post={post} />
          ))}
          {communityPosts.length === 0 && !loading && (
            <EmptyView
              title={'아직 작성한 글이 없어요\n당신의 첫 이야기를 들려주세요'}
              actionText="커뮤니티로 이동해볼까요?"
              onActionClick={() => navigate('/community')}
              actionType="link"
            />
          )}
        </div>
      )}

      {/* 게시글 탭 - 편의점 게시판 */}
      {tab === '게시글' && chip === '편의점 게시판' && (
        <MyConveniencePostItem products={conveniencePosts} />
      )}

      {/* 댓글 탭 */}
      {tab === '댓글'}
    </div>
  );
};

export default MyPostsPage;
