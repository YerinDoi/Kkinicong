import { useCallback } from 'react';

export const useShare = () => {
  const share = useCallback(async () => {
    const shareData = {
      title: 'kkinicong',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('공유 성공');
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('클립보드에 링크가 복사되었습니다.');
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return { share };
};