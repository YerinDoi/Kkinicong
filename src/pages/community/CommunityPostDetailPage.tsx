// src/pages/CommunityPostDetail.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';

interface Comment {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  isMyComment: boolean | null;
}

interface PostDetail {
  postId: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  viewCount: number;
  isLiked: boolean | null;
  isModified: boolean;
  isMyCommunityPost: boolean | null;
  comments: Comment[];
}

const CommunityPostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/community/post/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="text-sm text-gray-500">
        작성자: {post.author} • {post.createdAt} • 조회수: {post.viewCount}
      </p>
      <div className="mt-4">{post.content}</div>

      {post.isLiked !== null && (
        <button className="mt-2">
          {post.isLiked ? ' 좋아요 취소' : ' 좋아요'}
        </button>
      )}

      <hr className="my-6" />
      <h3 className="text-lg font-semibold">댓글</h3>
      <ul className="mt-2 space-y-2">
        {post.comments.map((c) => (
          <li key={c.commentId} className="border p-2 rounded">
            <p className="text-sm text-gray-700">{c.content}</p>
            <p className="text-xs text-gray-500">
              {c.author} • {c.createdAt}
              {c.isMyComment && ' (내 댓글)'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityPostDetail;
