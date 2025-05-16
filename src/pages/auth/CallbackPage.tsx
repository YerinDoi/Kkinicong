import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';

export default function CallbackPage() {
  const { provider } = useParams(); // kakao / naver / google
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasCalled = useRef(false); // ✅ 중복 호출 방지용 ref

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || !provider || hasCalled.current) return;

    hasCalled.current = true; // ✅ 한 번 실행되면 막음

    (async () => {
      try {
        const user = await login(
          provider.toUpperCase() as 'KAKAO' | 'NAVER' | 'GOOGLE',
          code,
        );
        console.log('✅ 로그인 성공!!!!!!!!!!!!!!:', user);

        if (!user.nickname) navigate('/nickname');
        else navigate('/');
      } catch (e) {
        console.error('❌ 로그인 실패:ㅠㅠㅠㅠㅠㅠㅠㅠ', e);
        alert('로그인에 실패했습니다.');
        navigate('/login');
      }
    })();
  }, []);

  return <div className="text-center mt-20">🔐 로그인 처리 중입니다...</div>;
}
