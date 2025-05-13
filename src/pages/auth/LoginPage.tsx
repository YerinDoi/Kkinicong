import LogoIcon from '@/assets/svgs/logo/logo-icon-horizontal.svg?react';
import LogoTextIcon from '@/assets/svgs/logo/logo-text.svg?react';
import kakaoIcon from '@/assets/svgs//login/kakao-icon.svg';
import naverIcon from '@/assets/svgs/login/naver-icon.svg';
import googleIcon from '@/assets/svgs/login/google-icon.svg';

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

const loginWithKakao = () => {
  const url = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = url;
};

const loginWithNaver = () => {
  const state = crypto.randomUUID(); // CSRF 방지용(네이버 필수)
  const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`;
  window.location.href = url;
};

const loginWithGoogle = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
  window.location.href = url;
};

export default function LoginPage() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center px-12">
        {/* 아이콘 영역 */}
        <div className="flex flex-col items-center gap-6 mb-24">
          <LogoIcon className="w-16" />
          <LogoTextIcon className="w-28" />
        </div>
        {/* 로그인 버튼 영역 */}
        <div className="flex flex-col gap-4 text-title-sb-button font-semibold">
          <button
            onClick={loginWithKakao}
            className="flex items-center justify-between gap-2 bg-yellow-300 text-black rounded-[12px] py-4 px-12"
          >
            <img src={kakaoIcon} alt="카카오" className="w-5 h-5" />
            카카오로 시작하기
          </button>
          <button
            onClick={loginWithNaver}
            className="flex items-center justify-between gap-2 bg-green-500 text-white rounded-[12px] py-4 px-12"
          >
            <img src={naverIcon} alt="네이버" className="w-5 h-5" />
            네이버로 시작하기
          </button>
          <button
            onClick={loginWithGoogle}
            className="flex items-center justify-between gap-2 border border-gray-400 text-black rounded-[12px] py-4 px-12"
          >
            <img src={googleIcon} alt="구글" className="w-5 h-5" />
            Google로 시작하기
          </button>
        </div>
      </div>
    </>
  );
}
