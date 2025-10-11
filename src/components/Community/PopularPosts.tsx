import React, { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

interface Post {
  communityPostId: number;
  title: string;
}

const PopularPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get('/api/v1/community/post/popular')
      .then((res) => {
        setPosts(res.data.results.communityPostPopularResponses); // 이 구조는 API 응답 형식에 따라 조정해야 함
      })
      .catch((err) => {
        console.error('인기글 불러오기 실패', err);
      });
  }, []);

  const handleClick = (communityPostId: number) => {
    navigate(`/community/post/${communityPostId}`);
  };

  return (
    <div className="px-[20px] py-[12px] flex flex-col gap-[8px]">
      <p className="text-title-sb-button font-bold">이번주 인기글</p>
      <div className="rounded-[4px] border border-main-color h-[39px] ">
        {posts.length >= 1 && (
          <Swiper
            direction="vertical"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            modules={[Autoplay]}
            slidesPerView={1}
            allowTouchMove={false}
            observer={true}
            observeParents={true}
            style={{ height: '39px' }} // 반드시 추가
          >
            {posts.map((post, idx) => (
              <SwiperSlide key={`${post.communityPostId}-${idx}`}>
                <div className="h-[39px] w-full flex  px-[12px]">
                  <button
                    onClick={() => handleClick(post.communityPostId)}
                    className="text-caption-m text-left truncate w-full flex items-center gap-[8px]"
                  >
                    <span className="text-sub-color font-semibold">
                      {idx + 1}.
                    </span>
                    <span className="text-main-gray font-regular text-body-md-description ">
                      {post.title}
                    </span>
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default PopularPosts;
