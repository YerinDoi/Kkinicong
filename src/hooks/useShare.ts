// useShare.ts
import { useCallback } from 'react';

type ShareOpts = {
  title?: string;
  text?: string;
  url?: string;
};

export const useShare = (defaults?: ShareOpts) => {
  const share = useCallback(async (opts?: ShareOpts) => {
    const merged = { ...defaults, ...opts };
    const shareData: ShareData = {};
    if (merged.title) shareData.title = merged.title;
    if (merged.text)  shareData.text  = merged.text;
    shareData.url = merged.url ?? window.location.href;

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('공유 성공');
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareData.url!);
        alert('클립보드에 링크가 복사되었습니다.');
      } catch (err) {
        console.error(err);
      }
    }
  }, [defaults]);

  return { share };
};
