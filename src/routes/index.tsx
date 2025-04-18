import { Routes, Route } from 'react-router-dom';
import Home from '../pages/HomePage';
import Login from '../pages/Login/LoginPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Router;
