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

  const loadPosts = async () => {
    if (!keyword.trim() || keyword.trim().length < 2 || keyword.trim().length > 15 || isLoadingRef.current) return;

    isLoadingRef.current = true;

    try {
      const res = await axiosInstance.get("/api/v1/community/search", {
        params: { keyword, page:0 ,size:10 },
      });

      const data = res.data.results;
      const newPosts = data.content;
      console.log(res.request.responseURL)
      console.log("전체 응답", res.data);


      console.log("받은 데이터", data.content);

      setPosts(prev => (page === 0 ? newPosts : [...prev, ...newPosts]));
      hasNextPageRef.current = page + 1 < data.totalPages;
    } catch (err) {
      console.error("검색 실패", err);
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
  if (keyword.trim().length >= 2 && keyword.trim().length <= 15) {
    loadPosts();
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

  // 직접 호출
  loadPosts();
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
      {posts.length === 0 ? (
        <CommunitySearchEmptyView keyword={keyword} />
      ) : (
        posts.map((post) => (
          <PostItem key={post.communityPostId} post={post} keyword={keyword} />
        ))
      )}
    </div>
    <div ref={loaderRef} style={{ height: 20 }} />


      
    </div>

  );
};

export default CommunitySearchPage;
