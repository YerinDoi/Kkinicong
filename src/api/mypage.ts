import axiosInstance from "./axiosInstance";

// 내가 쓴 커뮤니티 글 조회
export const getMyCommunityPosts = (page: number, size: number) =>
  axiosInstance.get("/api/v1/mypage/community", {
    params: { page, size },
  });

// 내가 쓴 편의점 게시판 글 조회
export const getMyConveniencePosts = (page: number, size: number) =>
  axiosInstance.get("/api/v1/mypage/convenience", {
    params: { page, size },
  });