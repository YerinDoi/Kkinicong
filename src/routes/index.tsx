import { Routes, Route } from 'react-router-dom';
import Home from '../pages/HomePage';
import Login from '../pages/Login/LoginPage';
import CallbackPage from '@/pages/Login/CallbackPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/:provider/callback" element={<CallbackPage />} />
    </Routes>
  );
};

export default Router;
