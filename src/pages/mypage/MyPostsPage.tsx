import TopBar from '@/components/common/TopBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabBar from '@/components/Mypage/TabBar';
import { useEffect, useRef, useState, useCallback } from 'react';
import ChipGroup from '@/components/Mypage/ChipGroup';
import MyConveniencePostItem from '@/components/Mypage/MyConveniencePostItem';
import {
  getMyCommunityPosts,
  getMyConveniencePosts,
  getMyComments,
} from '@/api/mypage';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import MyCommentPostList from '@/components/Mypage/MyCommentPostList';
import MyCommunityPostList from '@/components/Mypage/MyCommunityPostList';

const PAGE_SIZE = 10;

const MyPostsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || '게시글';
  const chip = searchParams.get('chip') || '커뮤니티';

  // 게시글 데이터 상태 (any[]로 타입 지정)
  const [conveniencePosts, setConveniencePosts] = useState<any[]>([]);
  const [conveniencePage, setConveniencePage] = useState(0);
  const [hasNextConveniencePage, setHasNextConveniencePage] = useState(true);
  const [convenienceLoading, setConvenienceLoading] = useState(false);
  const isLoadingConvenienceRef = useRef(false);
  const hasNextConveniencePageRef = useRef(true);

  // 내가 쓴 댓글 상태
  const [commentPosts, setCommentPosts] = useState<any[]>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [hasNextCommentPage, setHasNextCommentPage] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const isLoadingCommentRef = useRef(false);
  const hasNextCommentPageRef = useRef(true);

  // 커뮤니티 빈 상태
  const [isCommunityEmpty, setIsCommunityEmpty] = useState(false);
  const [isConvenienceEmpty, setIsConvenienceEmpty] = useState(false);

  // 탭/칩 변경 핸들러
  const handleTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab, chip });
  };
  const handleChipChange = (newChip: string) => {
    setSearchParams({ tab, chip: newChip });
  };

  function fetchConveniencePosts() {
    if (isLoadingConvenienceRef.current || !hasNextConveniencePageRef.current) {
      return;
    }
    setConvenienceLoading(true);
    isLoadingConvenienceRef.current = true;
    getMyConveniencePosts(conveniencePage, PAGE_SIZE)
      .then((res) => {
        const newPosts = res.data.results.content;
        setConveniencePosts((prev: any[]) => {
          const prevIds = new Set(prev.map((p: any) => p.id));
          const filtered = (newPosts as any[]).filter(
            (p: any) => !prevIds.has(p.id),
          );
          return [...prev, ...filtered];
        });
        const isLast =
          res.data.results.currentPage + 1 >= res.data.results.totalPage;
        setHasNextConveniencePage(!isLast);
        hasNextConveniencePageRef.current = !isLast;
        // 페이지 증가는 무한스크롤에서만 (첫 로딩이 아닐 때만)
        if (conveniencePage > 0) {
          setConveniencePage((prev) => prev + 1);
        } else {
          setConveniencePage(1); // 첫 로딩 후에는 1페이지로 설정
        }
      })
      .finally(() => {
        setConvenienceLoading(false);
        isLoadingConvenienceRef.current = false;
      });
  }

  useEffect(() => {
    if (tab !== '게시글' || chip !== '편의점 게시판') return;

    // 모든 상태 완전 초기화
    setConveniencePosts([]);
    setConveniencePage(0);
    setHasNextConveniencePage(true);
    hasNextConveniencePageRef.current = true;
    isLoadingConvenienceRef.current = false;
    setConvenienceLoading(false);

    // 직접 0페이지 요청
    setConvenienceLoading(true);
    isLoadingConvenienceRef.current = true;
    getMyConveniencePosts(0, PAGE_SIZE)
      .then((res) => {
        const newPosts = res.data.results.content;
        setConveniencePosts(newPosts);
        const isLast =
          res.data.results.currentPage + 1 >= res.data.results.totalPage;
        setHasNextConveniencePage(!isLast);
        hasNextConveniencePageRef.current = !isLast;
        setConveniencePage(1); // 첫 로딩 후에는 1페이지로 설정
      })
      .finally(() => {
        setConvenienceLoading(false);
        isLoadingConvenienceRef.current = false;
      });
  }, [tab, chip]);

  const { loaderRef: convenienceLoaderRef } = useInfiniteScroll({
    onIntersect: fetchConveniencePosts,
    isLoadingRef: isLoadingConvenienceRef,
    hasNextPageRef: hasNextConveniencePageRef,
    threshold: 0.01,
  });

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
        <MyCommunityPostList onEmptyChange={setIsCommunityEmpty} chip={chip} />
      )}

      {/* 게시글 탭 - 편의점 게시판 */}
      {tab === '게시글' && chip === '편의점 게시판' && (
        <MyConveniencePostItem
          products={conveniencePosts}
          onEmptyChange={setIsConvenienceEmpty}
          hasNextPage={hasNextConveniencePage}
          loaderRef={convenienceLoaderRef}
          loading={convenienceLoading}
        />
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
