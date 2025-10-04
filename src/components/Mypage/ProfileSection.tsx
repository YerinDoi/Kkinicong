import ProfileImg from '@/assets/svgs/common/profile-img.svg';
import EditIcon from '@/assets/svgs/common/edit-icon.svg';

interface ProfileSectionProps {
  isLoggedIn: boolean;
  nickname?: string;
  canEditNickname?: boolean;
  onEditNickname?: () => void;
  onLogin?: () => void;
}

const ProfileSection = ({
  isLoggedIn,
  nickname,
  canEditNickname,
  onEditNickname,
  onLogin,
}: ProfileSectionProps) => {
  return (
    <div className="flex items-center w-[315px] gap-[12px]">
      {/* 프로필 이미지 (고정) */}
      <img src={ProfileImg} alt="프로필" className="w-[64px] h-[64px]" />

      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-[8px]">
            <span className="font-pretendard text-[16px] font-bold leading-normal tracking-[0.016px] text-[#212121]">
              {nickname}
            </span>
            {canEditNickname && onEditNickname && (
              <button onClick={onEditNickname}>
                <img src={EditIcon} alt="닉네임 수정" />
              </button>
            )}
          </div>
        </>
      ) : (
        <button
          className="
            font-pretendard
            text-[16px]
            font-bold
            leading-normal
            tracking-[0.016px]
            text-text-gray
            underline
            underline-offset-2
            decoration-solid
            decoration-1
          "
          style={{
            textDecorationSkipInk: 'auto',
            textUnderlinePosition: 'from-font',
          }}
          onClick={onLogin}
        >
          로그인하러 가기
        </button>
      )}
    </div>
  );
};

export default ProfileSection;
