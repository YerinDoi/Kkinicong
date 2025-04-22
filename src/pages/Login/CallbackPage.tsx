// src/pages/CallbackPage.tsx
import { useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginWithSocial } from '@/store/authSlice';

export default function CallbackPage() {
  const { provider } = useParams(); // kakao | naver | google
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const code = searchParams.get('code');

  useEffect(() => {
    if (!provider || !code) return;

    const fetchToken = async () => {
      try {
        const res = await fetch(
          `/api/v1/auth/login/${provider.toUpperCase()}?code=${code}`,
          {
            method: 'GET', // 백엔드와 협의된 방식 사용
          },
        );
        const data = await res.json();

        if (data.isSuccess) {
          dispatch(loginWithSocial(data.results.accessToken));
          localStorage.setItem('accessToken', data.results.accessToken);
          navigate('/');
        } else {
          alert(`${provider} 로그인 실패: ${data.message}`);
        }
      } catch (err) {
        console.error(`${provider} 로그인 에러:`, err);
      }
    };

    fetchToken();
  }, [provider, code]);

  return <div>{provider} 로그인 처리 중입니다...</div>;
}
