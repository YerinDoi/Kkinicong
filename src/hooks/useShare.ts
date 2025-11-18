import { useCallback } from 'react';
import { trackShareStore } from '@/analytics/ga';

export const useShare = (storeId?: string | number) => {
  const share = useCallback(async () => {
    const shareData = {
      title: 'kkinicong',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('공유 성공');
        // 공유 이벤트 태깅
        if (storeId) {
          trackShareStore(storeId, 'native_share');
        }
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('클립보드에 링크가 복사되었습니다.');
        // 클립보드 복사 이벤트 태깅
        if (storeId) {
          trackShareStore(storeId, 'clipboard');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [storeId]);

  return { share };
};
