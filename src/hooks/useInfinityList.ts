import { useCallback, useEffect, useRef, useState } from 'react';
import useInfiniteScroll from './useInfiniteScroll';

interface UseInfinityListOptions<T> {
  fetchFn: (page: number, size: number) => Promise<any>;
  deps: any[];
  idKey: keyof T;
  pageSize?: number;
}

function useInfinityList<T = any>({
  fetchFn,
  deps,
  idKey,
  pageSize = 10,
}: UseInfinityListOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const isLoadingRef = useRef(false);
  const hasNextPageRef = useRef(true);

  // 데이터 패칭
  const fetchMore = useCallback(() => {
    if (isLoadingRef.current || !hasNextPageRef.current) return;
    setLoading(true);
    isLoadingRef.current = true;
    fetchFn(page, pageSize)
      .then((res) => {
        const newItems = res.data.results.content;
        setItems((prev) => {
          const prevIds = new Set(prev.map((item) => item[idKey]));
          const filtered = (newItems as T[]).filter(
            (item) => !prevIds.has(item[idKey]),
          );
          return [...prev, ...filtered];
        });
        const isLast =
          res.data.results.currentPage + 1 >= res.data.results.totalPage;
        setHasNextPage(!isLast);
        hasNextPageRef.current = !isLast;
        if (page > 0) {
          setPage((prev) => prev + 1);
        } else {
          setPage(1);
        }
      })
      .finally(() => {
        setLoading(false);
        isLoadingRef.current = false;
      });
  }, [fetchFn, page, pageSize, idKey]);

  // 초기화 및 deps 변경 시
  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasNextPage(true);
    hasNextPageRef.current = true;
    isLoadingRef.current = false;
    setLoading(false);

    setLoading(true);
    isLoadingRef.current = true;
    fetchFn(0, pageSize)
      .then((res) => {
        setItems(res.data.results.content);
        const isLast =
          res.data.results.currentPage + 1 >= res.data.results.totalPage;
        setHasNextPage(!isLast);
        hasNextPageRef.current = !isLast;
        setPage(1);
      })
      .finally(() => {
        setLoading(false);
        isLoadingRef.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // 무한스크롤 훅
  const { loaderRef } = useInfiniteScroll({
    onIntersect: fetchMore,
    isLoadingRef,
    hasNextPageRef,
    threshold: 0.01,
  });

  // 수동 초기화 함수
  const reset = () => {
    setItems([]);
    setPage(0);
    setHasNextPage(true);
    hasNextPageRef.current = true;
    isLoadingRef.current = false;
    setLoading(false);
  };

  return {
    items,
    loading,
    hasNextPage,
    loaderRef,
    reset,
  };
}

export default useInfinityList;
