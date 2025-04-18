import logo from '@/assets/svgs/logo/cong-logo.svg';
import kakaoIcon from '@/assets/svgs/login/kakao.svg';
import naverIcon from '@/assets/svgs/login/naver.svg';
import googleIcon from '@/assets/svgs/login/google.svg';

export default function LoginPage() {
  return (
    <>
      <div className="h-full flex flex-col justify-center px-6">
        <button className="mb-8 text-xl">←</button>

        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="끼니콩 로고" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-[#5B3B19]">끼니콩</h1>
        </div>

        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-center gap-2 bg-yellow-300 text-black rounded-xl py-3 shadow">
            <img src={kakaoIcon} alt="카카오" className="w-5 h-5" />
            카카오로 시작하기
          </button>
          <button className="flex items-center justify-center gap-2 bg-green-500 text-white rounded-xl py-3 shadow">
            <img src={naverIcon} alt="네이버" className="w-5 h-5" />
            네이버로 시작하기
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-400 text-black rounded-xl py-3">
            <img src={googleIcon} alt="구글" className="w-5 h-5" />
            Google로 시작하기
          </button>
        </div>
      </div>
    </>
  );
}
