// components/PostItem.tsx
import MainTag from "../StoreReview/MainTag";
import CommentIcon from "@/assets/svgs/common/comment.svg"

export interface Post {
  communityPostId: number;
  category: string;
  titlePreview: string;
  contentPreview: string;
  thumbnailUrl?:string;
  imageCount?:number;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  nickname?:string;
}

const PostItem = ({ post }: { post: Post }) => {
  const hasThumbnail = !!post.thumbnailUrl; //썸네일 유무에 따라 레이아웃 달라짐
  return (
    <div className="flex flex-col px-[20px] gap-[12px] py-[12px] border-b border-[#C3C3C3]">
    
      <div className={`flex ${hasThumbnail ? 'flex-row justify-between ' : 'flex-col gap-[12px]'} `}> 
        <MainTag rounded="rounded-[8px]" text={post.category} />
        <div className="flex flex-col gap-[8px]">
          <h3 className="font-semibold text-title-sb-button">
            {post.titlePreview.length > 25 ? post.titlePreview.slice(0, 25) + '…' : post.titlePreview}
          </h3>
          <p className="text-body-md-title text-[#C3C3C3]">
            {post.contentPreview.length > 50 ? post.contentPreview.slice(0, 50) + '…' : post.contentPreview}
          </p>
        </div>

         {hasThumbnail && (
          <div className="relative w-[88px] h-[88px] rounded-[8px] overflow-hidden shrink-0">
            <img
              src={post.thumbnailUrl}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
            {(post.imageCount ?? 0) > 0  && (
              <div className="absolute top-[4px] left-[4px] w-[29.3px] h-[29.3px] bg-[rgba(68,60,54,0.94)] text-white text-[12px] px-[7px] py-[2px] rounded-[8px]">
                {post.imageCount}
              </div>
            )}
          </div>
        )}
      </div>
      

      
      <div className="flex justify-between text-body-md-title text-[#C3C3C3]">
        <div className="flex gap-[2px]">
          <span> 좋아요 {post.likeCount}</span> ·
          <span>{post.createdAt}</span> · 
          <span> 조회 {post.viewCount}</span>

        </div>
        
        <div className="flex gap-[4px] items-center text-title-sb-button">
           <img src ={CommentIcon} className="w-[15px] h-[14px]"/>
           {post.commentCount}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
