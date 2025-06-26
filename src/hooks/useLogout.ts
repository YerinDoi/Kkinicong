import { useDispatch } from 'react-redux';
import { clearUser } from '@/store/userSlice';

export const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(clearUser());
    window.location.reload();
  };

  return { handleLogout };
};
