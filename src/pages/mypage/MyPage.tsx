
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/api/axiosInstance';
import { clearUser } from '@/store/userSlice';

const MyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleWithdraw = async () => {
    const confirmed = window.confirm('정말 회원 탈퇴하시겠어요? ');
    if (!confirmed) return;

    try {
      await axiosInstance.delete('/api/v1/user/me');
      alert('회원 탈퇴가 완료되었습니다.');

      //  클라이언트 상태 초기화
      dispatch(clearUser());
      localStorage.removeItem('token'); // 만약 토큰 저장 방식이라면 제거

      //  홈으로 리디렉션
      navigate('/');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('탈퇴 처리 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  return (
    <div className="p-[24px] font-pretendard">
      <h1 className="text-xl font-bold mb-4">마이페이지</h1>

      <button
        onClick={handleWithdraw}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default MyPage;
