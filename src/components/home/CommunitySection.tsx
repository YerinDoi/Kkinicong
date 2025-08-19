
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Forward from '@/assets/icons/system/forward.svg';
import axiosInstance from '@/api/axiosInstance';
import Icon from '@/assets/icons';

interface Post {
  communityPostId: number;
  title: string;
}

function CommunitySection() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
  navigate('/community');
};



  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/api/v1/community/post/popular');
        const list: Post[] = res.data?.results?.communityPostPopularResponses ?? [];
        setPosts(list.slice(0, 3)); // 상위 3개만 노출
      } catch (err) {
        console.error('인기글 불러오기 실패', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="px-[20px] pb-[24px] flex flex-col gap-[20px]">

        <button className="flex flex-col gap-[8px] " onClick={handleClick} >
          <Icon name='community'/>
          <p className="text-black text-title-sb-button flex flex-col justify-between font-semibold text-left">
            <span>커뮤니티에서 다양한 이야기를 나눠보세요!</span>
          </p>
        </button>
        
      <div className="py-[16px] pl-[20px] pr-[19px] rounded-[10px] flex flex-col gap-[20px] shadow-custom min-h-[160px]">
        <div className="flex justify-between">
          <span className="text-title-sb-button font-semibold leading-[20px] text-[#212121]">
            오늘의 인기글
          </span>

          <button
            className="text-[#919191] text-body-md-description font-regular flex gap-[8px] items-center"
            onClick={handleClick}
          >
            <span>확인하러 가기 </span>
            <img src={Forward} className="w-[7px]" />
          </button>
        </div>
       
          <ul className="flex flex-col gap-[14px]">
            {posts.map((post,idx) => (
              <li
                key={post.communityPostId}
                onClick={() => navigate(`/community/post/${post.communityPostId}`)}
                className="flex justify-between h-[18px] items-center cursor-pointer text-body-md-title font-regular text-black"
              >
                <span>{post.title}</span>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
}

export default CommunitySection;
