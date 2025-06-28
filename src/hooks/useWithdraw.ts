import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/api/axiosInstance';
import { clearUser } from '@/store/userSlice';

export default function useWithdraw() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleWithdraw = async () => {
    const confirmed = window.confirm('정말 회원 탈퇴하시겠어요? ');
    if (!confirmed) return;

    try {
      await axiosInstance.delete('/api/v1/user/me');
      alert('회원 탈퇴가 완료되었습니다.');
      dispatch(clearUser());
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('탈퇴 처리 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  return handleWithdraw;
}
