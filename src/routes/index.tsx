import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { GpsProvider } from '@/contexts/GpsContext';

const Home = lazy(() => import('../pages/home/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const CallbackPage = lazy(() => import('@/pages/auth/CallbackPage'));
const NicknamePage = lazy(() => import('@/pages/auth/NicknamePage'));
const NicknamePageXXX = lazy(() => import('@/pages/auth/NicknamePageXXX'));
const MyNeighborhoodPage = lazy(() => import('@/pages/auth/MyNeighborhoodPage'));

const StoreMapPage = lazy(() => import('@/pages/store-map/StoreMapPage'));
const StoreSearchPage = lazy(() => import('@/pages/store-search/StoreSearchPage'));
const StoreReviewPage = lazy(() => import('@/pages/store-review/StoreReviewPage'));
const StoreDetailPage = lazy(() => import('@/pages/store-detail/StoreDetailPage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const ConvenienceStorePage = lazy(() => import('@/pages/convenience/ConveniencePage'));
const AddConveniencePage = lazy(() => import('@/pages/convenience/AddConveniencePage'));
const ConvenienceDetailPage = lazy(() => import('@/pages/convenience/ConvenienceDetailPage'));
const NameRecommendationPage = lazy(() => import('@/pages/convenience/NameRecommendationPage'));
const AccountDeletePage = lazy(() => import('@/pages/mypage/AccountDeletePage'));
const NicknameEditPage = lazy(() => import('@/pages/mypage/NicknameEditPage'));
const CommunityPage = lazy(() => import('@/pages/community/CommunityPage'));
const CommunityWritePage = lazy(() => import('@/pages/community/CommunityWritePage'));
const CommunitySearchPage = lazy(() => import('@/pages/community/CommunitySearchPage'));

const FeedbackPage = lazy(() => import('@/pages/mypage/FeedbackPage'));
const MyPostsPage = lazy(() => import('@/pages/mypage/MyPostsPage'));
const MyReviewsPage = lazy(() => import('@/pages/mypage/MyReviewsPage'));
const MyLikesPage = lazy(() => import('@/pages/mypage/MyLikesPage'));
const MyScrapPage = lazy(() => import('@/pages/mypage/MyScrapPage'));
const PostDetailPage = lazy(() => import('@/pages/community/CommunityPostDetailPage'));
const NotificationPage = lazy(() => import('@/pages/notification/NotificationPage'));

const Router = () => {
  return (
    <Suspense fallback={null}>
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
      <Route path="/community/search" element={<CommunitySearchPage />} />

      {/*알림*/}
      <Route path="/notification" element={<NotificationPage />} />
    </Routes>
    </Suspense>
  );
};

export default Router;
