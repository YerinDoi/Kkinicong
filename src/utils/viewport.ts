// 모바일 뷰포트 높이 문제 해결을 위한 유틸리티

export const setRealViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

export const initViewportHeight = () => {
  setRealViewportHeight();

  // 리사이즈 이벤트 리스너 추가
  const handleResize = () => {
    setRealViewportHeight();
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // 클린업 함수 반환
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
};
