import TopBar from '@/components/common/TopBar';
import EmptyView from '@/components/Mypage/EmptyView';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getMyReviews } from '@/api/mypage';
import MyReviewItem from '@/components/Mypage/MyReviewItem';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const PAGE_SIZE = 10;

const MyReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  // ref로도 관리 (useInfiniteScroll 훅 요구)
  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);

  // 페이지별 데이터 불러오기
  const fetchReviews = useCallback(async () => {
    if (isLoadingRef.current || !hasNextPageRef.current) return;
    setLoading(true);
    isLoadingRef.current = true;
    try {
      const res = await getMyReviews(page, PAGE_SIZE);
      const newReviews = res.data.results.content;
      setReviews((prev) => [...prev, ...newReviews]);
      // 다음 페이지가 있는지 판단
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
    setReviews([]);
    setPage(0);
    setHasNextPage(true);
    hasNextPageRef.current = true;
    isLoadingRef.current = false;
    // 첫 페이지 불러오기
    getMyReviews(0, PAGE_SIZE).then((res) => {
      setReviews(res.data.results.content);
      setTotalCount(res.data.results.totalCount);
      setPage(1);
      const isLast = 1 >= res.data.results.totalPage;
      setHasNextPage(!isLast);
      hasNextPageRef.current = !isLast;
    });
  }, []);

  // 무한스크롤 훅 사용
  const { loaderRef } = useInfiniteScroll({
    onIntersect: fetchReviews,
    isLoadingRef,
    hasNextPageRef,
  });

  // 새로고침 함수 (삭제 등에서 사용)
  const refreshReviews = () => {
    setReviews([]);
    setPage(0);
    setHasNextPage(true);
    hasNextPageRef.current = true;
    isLoadingRef.current = false;
    getMyReviews(0, PAGE_SIZE).then((res) => {
      setReviews(res.data.results.content);
      setPage(1);
      const isLast = 1 >= res.data.results.totalPage;
      setHasNextPage(!isLast);
      hasNextPageRef.current = !isLast;
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <TopBar
        title="내가 쓴 리뷰"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />
      {totalCount === 0 ? (
        <div className="flex flex-1 w-full h-full items-center justify-center bg-bg-gray">
          <EmptyView title={'아직 작성한 리뷰가 없어요'} />
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          <div className="bg-[#F3F5ED] font-pretendard text-title-sb-button text-text-gray px-[34px] py-[8px] font-semibold mt-[8px]">
            내가 쓴 리뷰 수 {totalCount}개
          </div>
          <div className="flex flex-col gap-[12px]">
            {reviews.map((review, idx) => (
              <MyReviewItem
                key={`${review.reviewId}-${idx}`}
                storeName={review.storeName}
                date={review.createdAt}
                rating={review.rating}
                content={review.content}
                imageUrl={review.imageUrl}
                tags={review.tags}
                storeId={review.storeId}
                reviewId={review.reviewId}
                setReviews={setReviews}
                refreshReviews={refreshReviews}
              />
            ))}
            {/* 무한스크롤 로더 */}
            {hasNextPage && <div ref={loaderRef}></div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
