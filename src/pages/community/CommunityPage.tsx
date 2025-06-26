import TopBar from "@/components/common/TopBar";
import { useNavigate } from "react-router-dom";
import AlarmIcon from '@/assets/icons/system/alarm.svg';
import SearchIcon from '@/assets/icons/system/search-black.svg';
import PopularPosts from "@/components/Community/PopularPosts";

const CommunityPage = () => {
  const navigate = useNavigate();
  return(
    <div className="px-[20px] flex flex-col">
      <TopBar title="커뮤니티"
              paddingX="px-[15px]"
              rightType="custom"
              customRightElement={<div className="flex gap-[14px]">
              <img src ={AlarmIcon}
                  onClick={() => navigate('/')} //추후 알림페이지로 수정
                  className="w-[18px] h-[20px] cursor-pointer"
                />
                <img src ={SearchIcon}
                  onClick={() => navigate('/')} //추후 검색페이지로 수정
                  className="w-[20px] h-[20px] cursor-pointer"
                />
              </div> }/>
      <PopularPosts/>

    </div>
    

  )
  
}

export default CommunityPage