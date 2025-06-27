import TopBar from "@/components/common/TopBar";
import { useNavigate } from "react-router-dom";
import AlarmIcon from '@/assets/icons/system/alarm.svg';
import SearchIcon from '@/assets/icons/system/search-black.svg';
import PopularPosts from "@/components/Community/PopularPosts";
import Dropdown from "@/components/common/Dropdown";

const CommunityPage = () => {
  const navigate = useNavigate();
  return(
    <div className="flex flex-col">
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
      <div className="flex justify-end pr-[20px]">
        <Dropdown
        options={['전체', '복지정보', '잡담해요', '양육/육아', '문의/도움', '생활꿀팁','칭찬/감사','기타']}
        onSelect={(val) => console.log('선택한 카테고리:', val)} // 이거 수정예정
      />

      </div>
      

    </div>
    

  )
  
}

export default CommunityPage