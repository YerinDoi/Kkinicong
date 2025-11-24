import { useDispatch } from 'react-redux';
import { clearUser } from '@/store/userSlice';
import { setUserId } from '@/analytics/ga';

export const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(clearUser());
    setUserId(null); // GA4 User-ID 제거
    // window.location.reload();
  };

  return { handleLogout };
};
