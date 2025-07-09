import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GreenButton from '@/components/common/GreenButton';
import TopBar from '@/components/common/TopBar';

import { checkNicknameDuplicate, registerNickname } from '@/api/user';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice'; // ✅ ❷ 닉네임 저장용 액션

export default function NicknamePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ ❷ 리덕스 상태 갱신용

  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null); // 중복 확인 여부
  const [isChecking, setIsChecking] = useState(false); // 중복 확인 중 여부
  const [isSubmitting, setIsSubmitting] = useState(false); // 등록 중 여부

  // 유효성 검사 함수
  const validateNickname = (value: string) => {
    const regex = /^[가-힣a-zA-Z0-9 ]+$/;
    if (value !== value.trim()) return '앞뒤 공백 없이 입력해주세요';
    if (value.trim().length === 0) return '닉네임을 입력해주세요';
    if (value.length > 8) return '7자 이내로 입력해주세요';
    if (!regex.test(value)) return '한글, 영문, 숫자, 공백만 사용할 수 있어요';
    return '';
  };

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError(validateNickname(value));
    setIsDuplicate(null); // 닉네임 변경 시 중복 확인 초기화
  };

  // ✅ ❶ 닉네임 중복 확인 : fetch → axios 사용 & api/user.ts 함수로 분리
  const checkDuplicate = async () => {
    if (error || nickname.length === 0) return;

    setIsChecking(true);
    try {
      const exists = await checkNicknameDuplicate(nickname);
      console.log('✅ 닉네임 중복 여부:', exists);

      if (exists) {
        setIsDuplicate(true);
        setError('이미 사용 중인 닉네임이에요');
      } else {
        setIsDuplicate(false);
        setError('');
      }
    } catch (err) {
      console.error('❌ 중복 확인 중 오류:', err);
      setError('중복 확인 중 오류가 발생했어요');
    } finally {
      setIsChecking(false);
    }
  };

  // ✅ ❷ 닉네임 등록 : fetch → axios 사용 & 상태 저장 + 리디렉션
  const handleRegister = async () => {
    if (!!error || isDuplicate !== false) return;

    setIsSubmitting(true);
    try {
      const result = await registerNickname(nickname); // 서버에서 등록 후 유저 정보 반환
      dispatch(setUser({ id: result.email, nickname: result.nickname })); // nickname, email 받아서 Redux에 저장

      // ✅ 선택: 새로고침에도 유지하고 싶다면 localStorage에도 저장
      // localStorage.setItem('nickname', result.nickname);
      // localStorage.setItem('email', result.email);

      navigate('/my-neighborhood');
    } catch (error) {
      console.error('닉네임 등록 에러:', error);
      setError('닉네임 등록 중 오류가 발생했어요');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full pb-[68px] font-pretendard">
      {/* 뒤로가기 버튼 */}
      <TopBar paddingX="px-[15px]" rightType="none" />

      {/* 타이틀 영역 */}
      <div className="mb-[48px] mt-[24px] px-6">
        <div className="flex flex-col justify-between h-[60px]">
          <h1 className="text-xl font-bold text-black">반가워요!</h1>
          <p className="text-xl font-semibold text-[#65CE58]">
            사용할 닉네임을 정해주세요
          </p>
        </div>

        <p className="text-body-md-title text-gray-400 mt-[16px]">
          설정한 닉네임은 마이페이지에서 수정할 수 있어요
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="mb-2 px-6">
        <div className="flex items-center border-b border-gray-300 py-2">
          <input
            value={nickname}
            onChange={handleChange}
            type="text"
            placeholder="최대 7자 (ex. 배고픈 콩쥐)"
            className="flex-1 outline-none text-title-sb-button placeholder-gray-400"
          />
          <button
            onClick={checkDuplicate}
            disabled={!!error || isChecking}
            className="text-body-md-title text-gray-700 border border-gray-400 rounded-full px-3 py-1 ml-2 disabled:opacity-50"
          >
            {isChecking ? '확인 중...' : '중복 확인'}
          </button>
        </div>
        {error && (
          <p className="text-body-md-title text-red-500 mt-1">{error}</p>
        )}
        {!error && isDuplicate === false && (
          <p className="text-body-md-title text-green-600 mt-1">
            사용 가능한 닉네임이에요
          </p>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="flex mt-auto justify-center">
        <GreenButton
          onClick={handleRegister}
          disabled={!!error || isDuplicate !== false || isSubmitting}
          text={'다음'}
        />
      </div>
    </div>
  );
}
