// 실시간 알림을 처리하는 커스텀 훅
// SSE (Server-Sent Events)를 사용하여 서버로부터 알림을 수신하고
// React Query 캐시에 저장합니다.

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/types/notification';

export const useSSE = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/notification/subscribe`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data: Notification = JSON.parse(event.data);
        console.log('📩 실시간 알림 도착:', data);

        // ✅ React Query 캐시에 추가
        queryClient.setQueryData<Notification[]>(['notifications'], (prev) => {
          if (!prev) return [data];
          const alreadyExists = prev.some(
            (n) => n.notificationId === data.notificationId,
          );
          if (alreadyExists) return prev;
          return [data, ...prev];
        });
      } catch (e) {
        console.error('실시간 알림 파싱 에러:', e);
      }
    };

    eventSource.onerror = () => {
      console.error('❌ SSE 연결 오류');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
};
