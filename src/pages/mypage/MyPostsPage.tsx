import TopBar from '@/components/common/TopBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabBar from '@/components/Mypage/TabBar';
import { useEffect, useRef, useState, useCallback } from 'react';
import ChipGroup from '@/components/Mypage/ChipGroup';
import PostItem from '@/components/Community/PostItem';
import MyConveniencePostItem from '@/components/Mypage/MyConveniencePostItem';
import {
  getMyCommunityPosts,
  getMyConveniencePosts,
  getMyComments,
} from '@/api/mypage';
import EmptyView from '@/components/Mypage/EmptyView';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import MyCommentPostList from '@/components/Mypage/MyCommentPostList';

const PAGE_SIZE = 10;

const MyPostsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || '게시글';
  const chip = searchParams.get('chip') || '커뮤니티';

  // 게시글 데이터 상태 (any[]로 타입 지정)
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [conveniencePosts, setConveniencePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 내가 쓴 댓글 상태
  const [commentPosts, setCommentPosts] = useState<any[]>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [hasNextCommentPage, setHasNextCommentPage] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const isLoadingCommentRef = useRef(false);
  const hasNextCommentPageRef = useRef(true);

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

  // 내가 쓴 댓글 무한스크롤 데이터 패칭
  const fetchComments = useCallback(async () => {
    if (isLoadingCommentRef.current || !hasNextCommentPageRef.current) return;
    setCommentLoading(true);
    isLoadingCommentRef.current = true;
    try {
      const res = await getMyComments(commentPage, PAGE_SIZE);
      const newPosts = res.data.results.content;
      setCommentPosts((prev) => {
        const all = [...prev, ...newPosts];
        return all.filter(
          (post, idx, arr) =>
            arr.findIndex((p) => p.postId === post.postId) === idx,
        );
      });
      const isLast =
        res.data.results.currentPage + 1 >= res.data.results.totalPage;
      setHasNextCommentPage(!isLast);
      hasNextCommentPageRef.current = !isLast;
      setCommentPage((prev) => prev + 1);
    } finally {
      setCommentLoading(false);
      isLoadingCommentRef.current = false;
    }
  }, [commentPage]);

  // 댓글 탭 첫 로딩
  useEffect(() => {
    if (tab !== '댓글') return;
    setCommentPosts([]);
    setCommentPage(0);
    setHasNextCommentPage(true);
    hasNextCommentPageRef.current = true;
    isLoadingCommentRef.current = false;
    setCommentLoading(true);
    getMyComments(0, PAGE_SIZE).then((res) => {
      setCommentPosts(res.data.results.content);
      setCommentPage(1);
      const isLast = 1 >= res.data.results.totalPage;
      setHasNextCommentPage(!isLast);
      hasNextCommentPageRef.current = !isLast;
      setCommentLoading(false);
    });
  }, [tab]);

  // 무한스크롤 훅 (댓글)
  const { loaderRef: commentLoaderRef } = useInfiniteScroll({
    onIntersect: fetchComments,
    isLoadingRef: isLoadingCommentRef,
    hasNextPageRef: hasNextCommentPageRef,
  });

  return (
    <div className="flex flex-col w-full h-full pt-[11px]">
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
      {tab === '댓글' && (
        <MyCommentPostList
          commentPosts={commentPosts}
          hasNextPage={hasNextCommentPage}
          loaderRef={commentLoaderRef}
          navigate={navigate}
          loading={commentLoading}
        />
      )}
    </div>
  );
};

export default MyPostsPage;
