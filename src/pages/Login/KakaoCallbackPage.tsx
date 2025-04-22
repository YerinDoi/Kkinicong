import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginWithSocial } from '@/store/authSlice';

export default function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const code = searchParams.get('code');

  // useEffect(() => {
  //   // URL에 code가 없으면 아무 일도 안 함
  //   if (!code) return;

  //   // API 호출 : 백엔드에 code 보내고, accessToken 받기
  //   const fetchToken = async () => {
  //     try {
  //       const res = await fetch(`/api/v1/auth/login/KAKAO?code=${code}`, {
  //         method: 'POST',
  //       });
  //       const data = await res.json();

  //       console.log('인가 코드:', code);
  //       console.log('받은 응답:', data);

  //       if (data.isSuccess) {
  //         const { accessToken } = data.results;
  //         dispatch(loginWithSocial(accessToken));
  //         localStorage.setItem('accessToken', accessToken);
  //         navigate('/');
  //       } else {
  //         alert('로그인 실패: ' + data.message);
  //       }
  //     } catch (err) {
  //       console.error('카카오 로그인 오류:', err);
  //     }
  //   };

  //   fetchToken();
  // }, [code]);

  // return <div className="p-4">로그인 처리 중입니다...</div>;
  useEffect(() => {
    if (!code) return;

    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/v1/auth/login/KAKAO?code=${code}`, {
          method: 'GET',
        });

        const text = await res.text();
        console.log('백엔드 응답 원본:', text + '???????');
      } catch (err) {
        console.error('fetch 에러:', err);
      }
    };

    fetchToken();
  }, [code]);
}
