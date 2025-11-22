import AppLayout from './components/layout/AppLayout';
import Router from '@/routes';
import { GpsProvider } from '@/contexts/GpsContext';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '@/store/userSlice';
import { useSSE } from '@/hooks/useSSE';
import { initViewportHeight } from '@/utils/viewport';
import { initGA, trackPageView, trackReturningUser } from '@/analytics/ga';
import { initMixpanel } from '@/analytics/mixpanel';

export default function App() {
  useSSE();
  const dispatch = useDispatch();

  // 모바일 뷰포트 높이 초기화
  useEffect(() => {
    const cleanup = initViewportHeight();
    return cleanup;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(setLoggedIn(true));
    }
  }, []);

  useEffect(() => {
    initGA();
    trackPageView(window.location.pathname + window.location.search);
    initMixpanel();

    // 리텐션 측정: 첫 방문 후 7일 이내 재방문 체크
    const firstVisitKey = 'kkinicong_first_visit';
    const now = Date.now();
    const firstVisit = localStorage.getItem(firstVisitKey);

    if (!firstVisit) {
      // 첫 방문
      localStorage.setItem(firstVisitKey, String(now));
    } else {
      // 재방문
      const firstVisitTime = parseInt(firstVisit, 10);
      const daysBetween = Math.floor(
        (now - firstVisitTime) / (1000 * 60 * 60 * 24),
      );

      if (daysBetween > 0 && daysBetween <= 7) {
        // 7일 이내 재방문
        trackReturningUser(daysBetween);
      }
    }
  }, []);

  return (
    <GpsProvider>
      <AppLayout>
        <Router />
      </AppLayout>
    </GpsProvider>
  );
}
