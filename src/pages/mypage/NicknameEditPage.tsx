import TopBar from '@/components/common/TopBar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GreenButton from '@/components/common/GreenButton';
import { checkNicknameDuplicate, updateNickname } from '@/api/user';
import ConfirmToast from '@/components/common/ConfirmToast';

const NicknameEditPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 유효성 검사 함수
  const validateNickname = (value: string) => {
    const regex = /^[가-힣a-zA-Z0-9 ]+$/;
    if (value !== value.trim()) return '앞뒤 공백 없이 입력해주세요';
    if (value.trim().length === 0) return '닉네임을 입력해주세요';
    if (value.length > 10) return '10자 이내로 입력해주세요';
    if (!regex.test(value)) return '한글, 영문, 숫자, 공백만 사용할 수 있어요';
    return '';
  };

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError(validateNickname(value));
    setIsDuplicate(null);
  };

  // 닉네임 중복 확인
  const checkDuplicate = async () => {
    if (error || nickname.length === 0) return;

    setIsChecking(true);
    try {
      const exists = await checkNicknameDuplicate(nickname);
      if (exists) {
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

  // 닉네임 수정
  const handleEdit = async () => {
    if (!!error || isDuplicate !== false) return;

    setIsSubmitting(true);
    try {
      await updateNickname(nickname);
      setShowToast(true);
      setTimeout(() => {
        navigate('/mypage');
      }, 1500);
    } catch (error) {
      console.error('닉네임 수정 에러:', error);
      setError('닉네임 수정 중 오류가 발생했어요');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full pb-[68px]">
      <TopBar
        title="닉네임 수정"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />

      <div className="flex flex-col px-[20px] gap-[48px]">
        <div className="flex flex-col flex-start w-[298px] gap-[12px] font-pretendard mt-[29px]">
          <p className="text-[20px] font-medium leading-[28px]">
            수정할 닉네임을 적어주세요
          </p>
          <p className="text-[14px] font-normal leading-[24px] text-[#919191]">
            닉네임 수정은 1회 가능해요
          </p>
        </div>

        {/* 입력 영역 */}
        <div className="flex flex-col">
          <div
            className="flex items-center py-2"
            style={{ borderBottom: '1.5px solid #919191' }}
          >
            <input
              value={nickname}
              onChange={handleChange}
              type="text"
              placeholder="최대 10자 (ex. 배고픈 콩쥐)"
              className="flex-1 outline-none text-title-sb-button font-medium placeholder-gray-400"
            />
            <button
              onClick={checkDuplicate}
              disabled={!!error || isChecking}
              style={{
                borderRadius: '100px',
                border: '1px solid #919191',
                background: '#FFF',
              }}
              className="text-body-md-title text-gray-700 px-3 py-1 ml-2 disabled:opacity-50"
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
      </div>

      {/* 하단 고정 버튼 */}
      <div className="flex mt-auto justify-center">
        <GreenButton
          onClick={handleEdit}
          disabled={!!error || isDuplicate !== false || isSubmitting}
          text={'변경하기'}
        />
      </div>

      {/* 변경 완료 토스트 */}
      {showToast && (
        <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-[9999]">
            <ConfirmToast text="닉네임 변경이 완료되었어요" />
        </div>
        )}
    </div>
  );
};

export default NicknameEditPage;
