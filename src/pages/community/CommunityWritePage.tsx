import { useState } from 'react';
import CategorySelector from '@/components/Community/CategorySelector';
// import ImageUploader from '@/components/Community/ImageUploader';
import { useNavigate } from 'react-router-dom';

export default function CommunityWritePage() {
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [images, setImages] = useState<File[]>([]);

  const isValid =
    category && title.trim().length >= 5 && content.trim().length >= 10;

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // formData.append('category', category);
      formData.append('title', title);
      formData.append('content', content);
      // images.forEach((img) => formData.append('images', img));

      // TODO: API 연결
      // await postCommunity(formData);

      navigate('/community');
    } catch (err) {
      alert('업로드 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="text-xl font-semibold">커뮤니티 글 작성</header>

      <CategorySelector value={category} onChange={setCategory} />

      <div>
        <input
          type="text"
          placeholder="글 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <textarea
          placeholder="내용을 작성해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2 h-40"
        />
      </div>

      {/* <ImageUploader images={images} setImages={setImages} /> */}

      <button
        disabled={!isValid}
        onClick={handleSubmit}
        className={`w-full py-3 rounded text-white font-semibold ${
          isValid ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        등록하기
      </button>
    </div>
  );
}
