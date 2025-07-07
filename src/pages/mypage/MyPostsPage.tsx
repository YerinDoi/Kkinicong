import TopBar from '@/components/common/TopBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabBar from '@/components/Mypage/TabBar';
import { useState } from 'react';
import ChipGroup from '@/components/Mypage/ChipGroup';
import MyConveniencePostItem from '@/components/Mypage/MyConveniencePostItem';
import {
  getMyCommunityPosts,
  getMyConveniencePosts,
  getMyComments,
} from '@/api/mypage';
import MyCommentPostList from '@/components/Mypage/MyCommentPostList';
import MyCommunityPostList from '@/components/Mypage/MyCommunityPostList';
import useInfinityList from '@/hooks/useInfinityList';

const PAGE_SIZE = 10;

// Product 타입 선언
interface Product {
  id: number;
  name: string;
  isAvailable: boolean;
}

const MyPostsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || '게시글';
  const chip = searchParams.get('chip') || '커뮤니티';

  // 빈 상태
  const [isCommunityEmpty, setIsCommunityEmpty] = useState(false);
  const [isConvenienceEmpty, setIsConvenienceEmpty] = useState(false);

  // 공통 무한스크롤 훅 사용
  const community = useInfinityList({
    fetchFn: getMyCommunityPosts,
    deps: [tab, chip],
    idKey: 'communityPostId',
    pageSize: PAGE_SIZE,
  });
  const convenience = useInfinityList<Product>({
    fetchFn: getMyConveniencePosts,
    deps: [tab, chip],
    idKey: 'id',
    pageSize: PAGE_SIZE,
  });
  const comments = useInfinityList({
    fetchFn: getMyComments,
    deps: [tab],
    idKey: 'postId',
    pageSize: PAGE_SIZE,
  });

  // 탭/칩 변경 핸들러
  const handleTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab, chip });
  };
  const handleChipChange = (newChip: string) => {
    setSearchParams({ tab, chip: newChip });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-[16px]">
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
      </div>

      {tab === '게시글' && (
        <ChipGroup
          options={['커뮤니티', '편의점 게시판']}
          selected={chip}
          onChange={handleChipChange}
          className={
            tab === '게시글' && chip === '커뮤니티' && isCommunityEmpty
              ? 'bg-[#F4F6F8]'
              : tab === '게시글' &&
                  chip === '편의점 게시판' &&
                  isConvenienceEmpty
                ? 'bg-[#F4F6F8]'
                : ''
          }
        />
      )}

      {/* 게시글 탭 - 커뮤니티 */}
      {tab === '게시글' && chip === '커뮤니티' && (
        <MyCommunityPostList
          posts={community.items}
          onEmptyChange={setIsCommunityEmpty}
          hasNextPage={community.hasNextPage}
          loaderRef={community.loaderRef}
          loading={community.loading}
          chip={chip}
        />
      )}

      {/* 게시글 탭 - 편의점 게시판 */}
      {tab === '게시글' && chip === '편의점 게시판' && (
        <MyConveniencePostItem
          products={convenience.items}
          onEmptyChange={setIsConvenienceEmpty}
          hasNextPage={convenience.hasNextPage}
          loaderRef={convenience.loaderRef}
          loading={convenience.loading}
        />
      )}

      {/* 댓글 탭 */}
      {tab === '댓글' && (
        <MyCommentPostList
          commentPosts={comments.items}
          hasNextPage={comments.hasNextPage}
          loaderRef={comments.loaderRef}
          navigate={navigate}
          loading={comments.loading}
        />
      )}
    </div>
  );
};

export default MyPostsPage;
