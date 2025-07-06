import AppLayout from './components/layout/AppLayout';
import Router from '@/routes';
import { GpsProvider } from '@/contexts/GpsContext';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '@/store/userSlice';
import { useSSE } from '@/hooks/useSSE';

export default function App() {
  useSSE();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(setLoggedIn(true));
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
