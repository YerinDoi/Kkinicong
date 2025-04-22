import { Routes, Route } from 'react-router-dom';
import Home from '../pages/HomePage';
import Login from '../pages/Login/LoginPage';
import KakaoCallbackPage from '@/pages/Login/KakaoCallbackPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />
    </Routes>
  );
};

export default Router;
