import { useState, useEffect, useRef } from "react";
import TopBar from "@/components/common/TopBar";
import SearchInput from "@/components/common/SearchInput";
import PostItem, { Post } from "@/components/Community/PostItem";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import axiosInstance from "@/api/axiosInstance";
import CommunitySearchEmptyView from "@/components/Community/CommunitySearchEmptyView";

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
      
      <div className="flex flex-col">
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
