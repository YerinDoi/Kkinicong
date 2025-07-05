import TopBar from '@/components/common/TopBar';
import { useNavigate } from 'react-router-dom';
import EmptyView from '@/components/Mypage/EmptyView';
import { useEffect, useState } from 'react';
import { getMyLikes } from '@/api/mypage';
import MyLikePost from '@/components/Mypage/MyLikePost';

const MyLikesPage = () => {
  const navigate = useNavigate();

  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLikes(0, 20)
      .then((res) => setLikes(res.data.results.content))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="flex flex-col w-full h-full pt-[11px]">
      <TopBar
        title="좋아요"
        rightType="none"
        onBack={() => navigate('/mypage')}
      />

      {loading ? null : likes.length === 0 ? (
        <div className="flex flex-1 w-full h-full items-center justify-center bg-[#F4F6F8]">
          <EmptyView title={'아직 좋아요 한 글이 없어요'} />
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          <div className="bg-[#F3F5ED] font-pretendard text-title-sb-button text-[#616161] px-[34px] py-[8px] font-medium mt-[8px]">
            좋아요 한 글 {likes.length}개
          </div>
          {/* MyLikePost 컴포넌트로 렌더링 */}
          <div className="flex flex-col">
            {likes.map((like) => (
              <MyLikePost key={like.communityPostId} like={like} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLikesPage;
