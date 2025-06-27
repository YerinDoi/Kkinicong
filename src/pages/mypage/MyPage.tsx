import Header from '@/components/Header';
import ProfileSection from '@/components/Mypage/ProfileSection';
import { useLoginStatus } from '@/hooks/useLoginStatus';
import FavoriteStoreCard from '@/components/Mypage/FavoriteStoreCard';
import MenuListBtn from '@/components/Mypage/MenuListBtn';

const MyPage = () => {
  const { isLoggedIn } = useLoginStatus();

  return (
    <div className="flex flex-col items-center w-full pt-[11px]">
      <Header title="마이페이지" />

      <div className="px-[30px] my-[24px]">
        <ProfileSection isLoggedIn={isLoggedIn} />
      </div>

      <div className="flex flex-col px-[20px] w-full gap-[20px]">
        <FavoriteStoreCard count={0} />
        <div className="flex flex-col gap-[8px]">
          <MenuListBtn label="내가 쓴 글" variant="default" />
          <MenuListBtn label="내가 쓴 리뷰" variant="default" />
          <MenuListBtn label="좋아요 한 글" variant="default" />
          <MenuListBtn label="즐겨찾는 지역" variant="default" />
        </div>
      </div>

      <hr className="w-full my-[20px]" style={{border: 'none', borderTop: '1.5px solid #E6E6E6', height: 0, transform: 'rotate(0.153deg)', flexShrink: 0}}/>

      <div className="flex flex-col px-[20px] w-full gap-[8px]">
        <MenuListBtn label="약관 및 정책" variant="secondary" />
        <MenuListBtn label="의견 남기기" variant="secondary" />
        {isLoggedIn && <MenuListBtn label="회원 탈퇴" variant="secondary" />}
      </div>
    </div>
  );
};

export default MyPage;
