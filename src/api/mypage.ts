import axiosInstance from './axiosInstance';

// 내가 쓴 커뮤니티 글 조회
export const getMyCommunityPosts = (page: number, size: number) =>
  axiosInstance.get('/api/v1/mypage/community', {
    params: { page, size },
  });

// 내가 쓴 편의점 게시판 글 조회
export const getMyConveniencePosts = (page: number, size: number) =>
  axiosInstance.get('/api/v1/mypage/convenience', {
    params: { page, size },
  });

// 내가 쓴 리뷰 조회
export const getMyReviews = (page: number, size: number) =>
  axiosInstance.get('/api/v1/mypage/review', {
    params: { page, size },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

// 좋아요 한 글 조회
export const getMyLikes = (page: number, size: number) =>
  axiosInstance.get('/api/v1/mypage/like', {
    params: { page, size },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

// 찜한 가게 조회
export const getMyScrapStores = () =>
  axiosInstance.get('/api/v1/mypage/scrap', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
