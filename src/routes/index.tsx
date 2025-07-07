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
import CommunityPage from '@/pages/community/CommunityPage';
import CommunityWritePage from '@/pages/community/CommunityWritePage';
import FeedbackPage from '@/pages/mypage/FeedbackPage';
import MyPostsPage from '@/pages/mypage/MyPostsPage';
import MyReviewsPage from '@/pages/mypage/MyReviewsPage';
import MyLikesPage from '@/pages/mypage/MyLikesPage';
import MyScrapPage from '@/pages/mypage/MyScrapPage';
import PostDetailPage from '@/pages/community/CommunityPostDetailPage';
import NotificationPage from '@/pages/notification/NotificationPage';

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
      {/*로그인,닉네임,마이페이지,자주가는지역*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/:provider/callback" element={<CallbackPage />} />
      <Route path="/nickname" element={<NicknamePage />} />
      <Route path="/nicknameXXX" element={<NicknamePageXXX />} />
      <Route path="/my-neighborhood" element={<MyNeighborhoodPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/account-delete" element={<AccountDeletePage />} />
      <Route path="/nickname-edit" element={<NicknameEditPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/my-posts" element={<MyPostsPage />} />
      <Route path="/my-reviews" element={<MyReviewsPage />} />
      <Route path="/my-likes" element={<MyLikesPage />} />
      <Route path="/my-scrap" element={<MyScrapPage />} />

      {/*가맹점 페이지*/}
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

      {/*편의점*/}
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

      {/*커뮤니티*/}
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/post/:postId" element={<PostDetailPage />} />
      <Route path="/community/write" element={<CommunityWritePage />} />

      {/*알림*/}
      <Route path="/notification" element={<NotificationPage />} />
    </Routes>
  );
};

export default Router;
