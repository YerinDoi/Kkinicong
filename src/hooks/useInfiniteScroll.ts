import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  onIntersect: () => void; // 로더 엘리먼트가 보일 때 실행될 콜백 함수
  isLoadingRef: React.MutableRefObject<boolean>; // 현재 로딩 상태 ref (외부에서 주입)
  hasNextPageRef: React.MutableRefObject<boolean>; // 다음 페이지 존재 여부 ref (외부에서 주입)
  root?: HTMLElement | null; // 스크롤 컨테이너 엘리먼트 (기본값: null, viewport)
  threshold?: number; // IntersectionObserver threshold
}

const useInfiniteScroll = ({
  onIntersect,
  isLoadingRef,
  hasNextPageRef,
  root = null,
  threshold = 0.1,
}: UseInfiniteScrollProps) => {
  const loaderRef = useRef<HTMLDivElement | null>(null); // 로더 엘리먼트 ref
  const observerRef = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver 콜백 함수
  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      // 로더가 보이고, 로딩 중이 아니며, 다음 페이지가 있을 때 onIntersect 호출
      // isLoadingRef와 hasNextPageRef는 항상 최신 값을 참조
      if (
        target.isIntersecting &&
        !isLoadingRef.current &&
        hasNextPageRef.current
      ) {
        onIntersect(); // 외부에서 전달받은 콜백 함수 실행
      } 
    },
    [onIntersect, isLoadingRef, hasNextPageRef],
  ); // 의존성 배열에 onIntersect, isLoadingRef, hasNextPageRef 추가

  useEffect(() => {
    // 기존 observer가 있으면 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      handleObserver,
      {
        root: root,
        rootMargin: '0px',
        threshold: threshold,
      },
    );

    // 로더 엘리먼트가 마운트되면 관찰 시작
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // observerRef 업데이트
    observerRef.current = observer;

    // cleanup 함수: 컴포넌트 언마운트 또는 의존성 변경 시 observer 해제
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleObserver, root, threshold]);

  // 무한 스크롤 훅은 로더 ref만 반환
  return { loaderRef };
};

export default useInfiniteScroll;
