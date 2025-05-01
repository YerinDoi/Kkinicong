import { Routes, Route } from 'react-router-dom';
import Home from '../pages/HomePage';
import Login from '../pages/Login/LoginPage';
import CallbackPage from '@/pages/Login/CallbackPage';
import StoreSearchPage from '@/pages/StoreSearch/StoreSearchPage';
import StoreReviewPage from '@/pages/StoreReview/StoreReviewPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/:provider/callback" element={<CallbackPage />} />
      <Route path="/store-search" element={<StoreSearchPage />} />
      <Route path="/store-review" element={<StoreReviewPage />} />
    </Routes>
  );
};

export default Router;
