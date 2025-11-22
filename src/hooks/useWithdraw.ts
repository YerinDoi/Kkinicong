import { useDispatch } from 'react-redux';
import axiosInstance from '@/api/axiosInstance';
import { clearUser } from '@/store/userSlice';
import { setUserId } from '@/analytics/ga';

export default function useWithdraw() {
  const dispatch = useDispatch();

  const handleWithdraw = async () => {
    try {
      await axiosInstance.delete('/api/v1/user/me');
      dispatch(clearUser());
      setUserId(null); // GA4 User-ID 제거
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('탈퇴 처리 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  return handleWithdraw;
}
