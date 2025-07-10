import { useState, useEffect, useRef } from "react";
import TopBar from "@/components/common/TopBar";
import SearchInput from "@/components/common/SearchInput";
import PostItem, { Post } from "@/components/Community/PostItem";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import axiosInstance from "@/api/axiosInstance";
import CommunitySearchEmptyView from "@/components/Community/CommunitySearchEmptyView";
import RecentKeyword from "@/components/Community/RecentKeyword";



const CommunitySearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);

  const pageRef = useRef(0);
  const hasNextPageRef = useRef(true);
  const isLoadingRef = useRef(false);
  const [isSearched, setIsSearched] = useState(false); 
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false); 
  const [recentKeywords, setRecentKeywords] = useState<{ keyword: string }[]>([]);
  const [showRecent, setShowRecent] = useState(true);
  const token = localStorage.getItem("accessToken"); 



  //검색 결과 불러오기
  const loadPosts = async (currentPage: number = 0, searchValue: string) => {
    if (!searchValue.trim() || searchValue.trim().length < 2 || searchValue.trim().length > 15 || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsSearchLoading(true);

    try {
      const res = await axiosInstance.get("/api/v1/community/search", {
        params: { keyword: searchValue, page: currentPage, size: 10 },
      });

      const data = res.data.results;
      const newPosts = data.content;

      setPosts(prev => (currentPage === 0 ? newPosts : [...prev, ...newPosts]));
      hasNextPageRef.current = currentPage + 1 < data.totalPages;
    } catch (err) {
      console.error("검색 실패", err);
    } finally {
      isLoadingRef.current = false;
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
  if (isSearched && searchedKeyword.trim().length >= 2 && searchedKeyword.trim().length <= 15) {
    loadPosts(page, searchedKeyword);  
  }
}, [page]);

  //최근 검색어 가져오기
  const fetchRecentKeywords = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/community/search/recent", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRecentKeywords(res.data.results);
  } catch (err) {
    console.error("최근 검색어 가져오기 실패", err);
  }
};


  useEffect(() => {
  if (!token) return; // 비회원은 호출 안 함
  fetchRecentKeywords();
}, []);

  //최근 검색어 삭제하기
  const handleDeleteKeyword = async (keyword: string) => {
  try {
    await axiosInstance.delete('/api/v1/community/search/recent', {
      
      headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
        keyword, 
      },
    });
    console.log("삭제 요청 keyword:", keyword);


    // 삭제 성공 시 local state에서도 제거
   setRecentKeywords((prev) =>
    prev.filter((item) => item.keyword !== keyword)
  );

  } catch (err) {


    console.error("최근 검색어 삭제 실패", err);
    alert("최근 검색어 삭제에 실패했어요");
  }
};



  const { loaderRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPageRef.current) {
        pageRef.current += 1;
        setPage(pageRef.current);
      }
    },
    isLoadingRef,
    hasNextPageRef,
    root: null,
    threshold: 0.2,
  });

  const handleSearch = () => {
  if (keyword.trim().length < 2 || keyword.trim().length > 15) {
    alert("검색어는 2자 이상 15자 이하여야 합니다.");
    return;
  }
  setShowRecent(false); //최근 검색어 안 보이게
  setPage(0); // 첫 페이지부터 검색
  pageRef.current = 0; // ref도 초기화
  setIsSearched(true); 
  setSearchedKeyword(keyword);
  loadPosts(0, keyword);

};


  return (
    <div className="flex flex-col ">
      <TopBar title="검색" />
      <div className="px-[20px]">
        <SearchInput
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
      />
      </div>
     {showRecent && !!recentKeywords.length && (
      <div className="flex flex-col gap-[20px] px-[20px] mt-3">
        <p className="text-body-md-title font-regular">최근 검색어</p>
        {recentKeywords.map((item, idx) => (
          <RecentKeyword
            key={idx}
            label={item.keyword} 
            onDelete={() => handleDeleteKeyword(item.keyword)} 
            />
          ))}

  </div>
)}


      <div className="flex flex-col ">
        {isSearched && !isSearchLoading && posts.length === 0 ? (
          <CommunitySearchEmptyView keyword={searchedKeyword} />
        ) : (
          posts.map((post) => (
            <PostItem key={post.communityPostId} post={post} keyword={searchedKeyword} />
          ))
        )}
      </div>

    <div ref={loaderRef} style={{ height: 20 }} />


      
    </div>

  );
};

export default CommunitySearchPage;
