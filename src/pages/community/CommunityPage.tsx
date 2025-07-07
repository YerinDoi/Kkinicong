import TopBar from '@/components/common/TopBar';
import { useNavigate } from 'react-router-dom';
import AlarmIcon from '@/assets/icons/system/alarm.svg';
import SearchIcon from '@/assets/icons/system/search-black.svg';
import PopularPosts from '@/components/Community/PopularPosts';
import Dropdown from '@/components/common/Dropdown';
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/api/axiosInstance';
import PostItem, { Post } from '@/components/Community/PostItem';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);

  const categoryMap: Record<string, string> = {
    전체: '',
    복지정보: 'WELFARE_INFO',
    잡담해요: 'CHITCHAT',
    '양육/육아': 'PARENTING',
    '문의/도움': 'QUESTION_HELP',
    생활꿀팁: 'LIFE_TIP',
    '칭찬/감사': 'APPRECIATION',
    기타: 'ETC',
  };

  const fetchPosts = async (
    categoryText: string,
    page: number,
    size?: number,
  ) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const categoryEnum = categoryMap[categoryText];
      const params: any = { page, size };
      if (categoryEnum) {
        params.category = categoryEnum;
      }

      const res = await axiosInstance.get('/api/v1/community/post', { params });

      const data = res.data.results.results;
      setPosts((prev) =>
        page === 0 ? data.content : [...prev, ...data.content],
      );

      hasNextPageRef.current = page + 1 < data.totalPages;
    } catch (err) {
      console.error('게시글 가져오기 실패', err);
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    fetchPosts(selectedCategory, page);
  }, [selectedCategory, page]);

  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPageRef.current) {
        pageRef.current += 1;
        console.log(
          '[찾기페이지 useInfiniteScroll] 다음 페이지 로드:',
          pageRef.current,
        );
        setPage(pageRef.current);
      }
    },
    isLoadingRef,
    hasNextPageRef,
    root: null,
    threshold: 0.2,
  });

  const PostList = ({ posts }: { posts: Post[] }) => {
    return (
      <div className="flex flex-col">
        {posts.map((post) => (
          <PostItem key={post.communityPostId} post={post} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col">
        <TopBar
          title="커뮤니티"
          paddingX="px-[15px]"
          rightType="custom"
          customRightElement={
            <div className="flex gap-[14px]">
              <img
                src={AlarmIcon}
                onClick={() => navigate('/notification')} 
                className="w-[18px] h-[20px] cursor-pointer"
              />
              <img
                src={SearchIcon}
                onClick={() => navigate('/community/search')} 
                className="w-[20px] h-[20px] cursor-pointer"
              />
            </div>
          }
        />
        <PopularPosts />
        <div className="flex justify-end pr-[20px]">
          <Dropdown
            options={[
              '전체',
              '복지정보',
              '잡담해요',
              '양육/육아',
              '문의/도움',
              '생활꿀팁',
              '칭찬/감사',
              '기타',
            ]}
            onSelect={(categoryText) => {
              setSelectedCategory(categoryText);
              setPage(0); // 새로운 카테고리 선택 시 첫 페이지로 초기화
            }}
          />
        </div>
        <PostList posts={posts} />
        <div ref={loaderRef} style={{ height: 20 }} />
      </div>
    </>
  );
};

export default CommunityPage;
