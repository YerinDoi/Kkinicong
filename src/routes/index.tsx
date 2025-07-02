import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/HomePage';
import { GpsProvider } from '@/contexts/GpsContext';

import LoginPage from '@/pages/auth/LoginPage';
import CallbackPage from '@/pages/auth/CallbackPage';
import NicknamePage from '@/pages/auth/NicknamePage';
import NicknamePageXXX from '@/pages/auth/NicknamePageXXX';
import MyNeighborhoodPage from '@/pages/auth/MyNeighborhoodPage';

import StoreMapPage from '@/pages/store-map/StoreMapPage';
import StoreSearchPage from '@/pages/store-search/StoreSearchPage';
import StoreReviewPage from '@/pages/store-review/StoreReviewPage';
import StoreDetailPage from '@/pages/store-detail/StoreDetailPage';
import MyPage from '@/pages/mypage/MyPage';
import ConvenienceStorePage from '@/pages/convenience/ConveniencePage';
import AddConveniencePage from '@/pages/convenience/AddConveniencePage';
import ConvenienceDetailPage from '@/pages/convenience/ConvenienceDetailPage';
import NameRecommendationPage from '@/pages/convenience/NameRecommendationPage';
import AccountDeletePage from '@/pages/mypage/AccountDeletePage';
import NicknameEditPage from '@/pages/mypage/NicknameEditPage';

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GpsProvider>
            <Home />
          </GpsProvider>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/:provider/callback" element={<CallbackPage />} />
      <Route path="/nickname" element={<NicknamePage />} />
      <Route path="/nicknameXXX" element={<NicknamePageXXX />} />
      <Route path="/my-neighborhood" element={<MyNeighborhoodPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/account-delete" element={<AccountDeletePage />} />
      <Route path="/nickname-edit" element={<NicknameEditPage />} />
      <Route
        path="/store-map"
        element={
          <GpsProvider>
            <StoreMapPage />
          </GpsProvider>
        }
      />
      <Route
        path="/store-search"
        element={
          <GpsProvider>
            <StoreSearchPage />
          </GpsProvider>
        }
      />
      <Route path="/store-review/:storeId" element={<StoreReviewPage />} />
      <Route path="/store/:storeId" element={<StoreDetailPage />} />

      <Route path="/convenience" element={<ConvenienceStorePage />} />
      <Route path="/convenience/add" element={<AddConveniencePage />} />

      <Route
        path="/convenience/post/:postId"
        element={<ConvenienceDetailPage />}
      />
      <Route
        path="/convenience/name-recommendation"
        element={<NameRecommendationPage />}
      />
    </Routes>
  );
};

export default Router;
