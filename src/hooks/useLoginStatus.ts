import { useState, useEffect } from 'react';

export const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // localStorage 변경 감지를 위한 이벤트 리스너
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트가 마운트될 때마다 상태 확인
    const interval = setInterval(checkLoginStatus, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { isLoggedIn, setIsLoggedIn };
};
