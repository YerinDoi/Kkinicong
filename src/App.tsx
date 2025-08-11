import AppLayout from './components/layout/AppLayout';
import Router from '@/routes';
import { GpsProvider } from '@/contexts/GpsContext';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '@/store/userSlice';
import { useSSE } from '@/hooks/useSSE';
import { initViewportHeight } from '@/utils/viewport';
import { initGA, trackPageView } from '@/analytics/ga';
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
  }, []);

  return (
    <GpsProvider>
      <AppLayout>
        <Router />
      </AppLayout>
    </GpsProvider>
  );
}
