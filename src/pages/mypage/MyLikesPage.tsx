import TopBar from '@/components/common/TopBar';
import { useNavigate } from 'react-router-dom';
import EmptyView from '@/components/Mypage/EmptyView';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getMyLikes } from '@/api/mypage';
import MyLikePost from '@/components/Mypage/MyLikePost';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const PAGE_SIZE = 20;

const MyLikesPage = () => {
  const navigate = useNavigate();

  const [likes, setLikes] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);

  // 데이터 패칭
  const fetchLikes = useCallback(async () => {
    if (isLoadingRef.current || !hasNextPageRef.current) return;
    setLoading(true);
    isLoadingRef.current = true;
    try {
      const res = await getMyLikes(page, PAGE_SIZE);
      const newLikes = res.data.results.content;
      setLikes((prev) => [...prev, ...newLikes]);
      const isLast =
        res.data.results.currentPage + 1 >= res.data.results.totalPage;
      setHasNextPage(!isLast);
      hasNextPageRef.current = !isLast;
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [page]);

  // 첫 페이지 로딩
  useEffect(() => {
    setLikes([]);
    setPage(0);
    setHasNextPage(true);
    hasNextPageRef.current = true;
    isLoadingRef.current = false;
    getMyLikes(0, PAGE_SIZE).then((res) => {
      setLikes(res.data.results.content);
      setTotalCount(res.data.results.totalCount);
      setPage(1);
      const isLast = 1 >= res.data.results.totalPage;
      setHasNextPage(!isLast);
      hasNextPageRef.current = !isLast;
    });
  }, []);

  // 무한스크롤 훅
  const { loaderRef } = useInfiniteScroll({
    onIntersect: fetchLikes,
    isLoadingRef,
    hasNextPageRef,
  });

  return (
    <div className="flex flex-col w-full h-full">
      <TopBar
        title="좋아요"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />

      {loading && totalCount === 0 ? null : totalCount === 0 ? (
        <div className="flex flex-1 w-full h-full items-center justify-center bg-[#F4F6F8]">
          <EmptyView title={'아직 좋아요 한 글이 없어요'} />
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          <div className="bg-[#F3F5ED] font-pretendard text-title-sb-button text-[#616161] px-[34px] py-[8px] font-semibold mt-[8px]">
            좋아요 한 글 {totalCount}개
          </div>

          <div className="flex flex-col">
            {likes.map((like) => (
              <MyLikePost key={like.communityPostId} like={like} />
            ))}
            {hasNextPage && <div ref={loaderRef}></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLikesPage;
