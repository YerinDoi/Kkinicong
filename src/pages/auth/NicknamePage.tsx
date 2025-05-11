import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NicknamePage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null); // 중복 확인 여부
  const [isChecking, setIsChecking] = useState(false); // 중복 확인 중 여부
  const [isSubmitting, setIsSubmitting] = useState(false); // 등록 중 여부

  // 유효성 검사 함수
  const validateNickname = (value: string) => {
    const regex = /^[가-힣a-zA-Z0-9]+$/;
    if (value.length === 0) return '닉네임을 입력해주세요';
    if (value.length > 10) return '10자 이내로 입력해주세요';
    if (!regex.test(value)) return '한글, 영문, 숫자만 사용할 수 있어요';
    return '';
  };

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError(validateNickname(value));
    setIsDuplicate(null); // 닉네임 변경 시 중복 확인 초기화
  };

  // 중복 확인
  const checkDuplicate = async () => {
    if (error || nickname.length === 0) return;

    setIsChecking(true);
    try {
      const res = await fetch(`/api/check-nickname?nickname=${nickname}`);
      const data = await res.json();

      if (data.exists) {
        setIsDuplicate(true);
        setError('이미 사용 중인 닉네임이에요');
      } else {
        setIsDuplicate(false);
        setError('');
      }
    } catch {
      setError('중복 확인 중 오류가 발생했어요');
    } finally {
      setIsChecking(false);
    }
  };

  // 닉네임 등록
  const registerNickname = async () => {
    if (!!error || isDuplicate !== false) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/register-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });

      if (!res.ok) throw new Error();

      // 성공 시 다음 페이지로 이동
      navigate('/home'); // 필요시 '/welcome' 등으로 변경 가능
    } catch {
      setError('닉네임 등록 중 오류가 발생했어요');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-8">
      {/* 뒤로가기 버튼 */}
      <button className="mb-6 text-xl">{'←'}</button>

      {/* 타이틀 영역 */}
      <div className="mb-48px">
        <h1 className="text-xl font-bold text-black">반가워요!</h1>
        <p className="text-lg font-semibold text-[#65CE58]">
          사용할 닉네임을 정해주세요
        </p>
        <p className="text-sm text-gray-400 mt-1">
          설정한 닉네임은 마이페이지에서 수정할 수 있어요
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="mb-2">
        <div className="flex items-center border-b border-gray-300 py-2">
          <input
            value={nickname}
            onChange={handleChange}
            type="text"
            placeholder="최대 10자 (ex. 배고픈 콩쥐)"
            className="flex-1 outline-none text-base placeholder-gray-400"
          />
          <button
            onClick={checkDuplicate}
            disabled={!!error || isChecking}
            className="text-sm text-gray-700 border border-gray-400 rounded-full px-3 py-1 ml-2 disabled:opacity-50"
          >
            {isChecking ? '확인 중...' : '중복 확인'}
          </button>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {!error && isDuplicate === false && (
          <p className="text-sm text-green-600 mt-1">
            사용 가능한 닉네임이에요
          </p>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="mt-auto">
        <button
          onClick={registerNickname}
          disabled={!!error || isDuplicate !== false || isSubmitting}
          className={`w-full rounded-xl py-4 text-base font-semibold transition ${
            !!error || isDuplicate !== false || isSubmitting
              ? 'bg-gray-200 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {isSubmitting ? '등록 중...' : '끼니콩 시작하기'}
        </button>
      </div>
    </div>
  );
}
