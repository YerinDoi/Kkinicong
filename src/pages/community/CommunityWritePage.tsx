import { useState,useEffect } from 'react';
import CategorySelector from '@/components/Community/CategorySelector';
import ImageUploader from '@/components/Community/ImageUploader';
import { useNavigate ,useSearchParams } from 'react-router-dom';
import TopBar from '@/components/common/TopBar';
import axiosInstance from '@/api/axiosInstance';
import { postCommunity, patchCommunity } from '@/api/community';
import { labelToValueMap } from '@/api/community';
import { uploadImages } from '@/api/communityImg';
import ConfirmToast from '@/components/common/ConfirmToast';
import { createPortal } from 'react-dom';

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<(File | string)[]>([]);
  const [showToast,setShowToast] = useState(false);


  const isValid =
    category && title.trim().length >= 5 && content.trim().length >= 10;
  
    //수정 모드일 경우 게시글 정보 불러오기
  useEffect(() => {
  if (!postId) return;
  const fetchPostDetail = async () => {
  
  try {
    const res = await axiosInstance.get(`/api/v1/community/post/${postId}`);
    console.log('게시글 데이터:', res.data);

    const { title, content, category, imageUrls } = res.data.results;

    setTitle(title);
    setContent(content);
    setCategory(labelToValueMap[category as keyof typeof labelToValueMap] || '');

    setImages(imageUrls); // 여기 수정할수도...
  } catch (err) {
    console.error('게시글 불러오기 실패:', err);
    alert('게시글 정보를 불러오지 못했어요.');
  }
};


    fetchPostDetail();
  }, [postId]);

  const handleSubmit = async () => {
  try {
    const isEditing = !!postId;
    let finalPostId = postId;

    const existingImageUrls = images.filter((img): img is string => typeof img === 'string');
    const newImageFiles = images.filter((img): img is File => img instanceof File);

    console.log('🧪 현재 모드:', isEditing ? '수정' : '등록');
    console.log('🧪 카테고리:', category);
    console.log('🧪 제목:', title);
    console.log('🧪 본문:', content);
    console.log('🧪 기존 이미지 URLs:', existingImageUrls);
    console.log('🧪 새로 추가된 이미지 Files:', newImageFiles);

    // 1. 신규 작성
    if (!isEditing) {
      const postRes = await postCommunity({ title, content, category });
      console.log('🧪 postRes:', postRes);

      finalPostId = postRes?.results?.communityPostId;
      if (!finalPostId) throw new Error('❌ communityPostId가 없습니다!');

      if (newImageFiles.length > 0) {
        const imageUrls = await uploadImages(finalPostId, newImageFiles);
        console.log('🧪 이미지 업로드 완료 (등록):', imageUrls);
      }

      setShowToast(true);
      setTimeout(() => {
        navigate('/community');
      }, 1500);
    }

    // 2. 수정
    if (isEditing && finalPostId) {
      console.log('🧪 PATCH 요청 데이터:', {
        title,
        content,
        category,
      });

      await patchCommunity(finalPostId, {
        title,
        content,
        category,
      });

      if (newImageFiles.length > 0) {
        const imageUrls = await uploadImages(finalPostId, newImageFiles);
        console.log('🧪 이미지 업로드 완료 (수정):', imageUrls);
      }

      alert('글이 성공적으로 수정되었습니다!');
      navigate(`/community/post/${finalPostId}`);
    }
  } catch (error) {
    console.error('🔥 저장 실패:', error);
  }
};





  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="커뮤니티 글 작성"
        // TODO: 임시 저장 기능 구현 예정
        // rightType="custom"
        // customRightElement={
        //   <button
        //     onClick={() => {
        //       console.log('임시저장!');
        //       // TODO: 임시 저장 로직 구현 예정
        //       alert('임시 저장했습니다.');
        //     }}
        //     className="text-[14px] text-body-md-title font-regular"
        //   >
        //     임시저장 <span>(개수)</span>
        //   </button>
        // }
      />
      <div className="p-5 flex-1 space-y-7">
        <div className="space-y-3">
          <span className="text-title-sb-button font-semibold">카테고리</span>
          <CategorySelector value={category} onChange={setCategory} />
        </div>

        <div className="space-y-3">
          <span className="text-title-sb-button font-semibold">제목</span>
          <input
            type="text"
            placeholder="글 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-[1px] border-[#C3C3C3] rounded-[12px] px-4 py-3 text-body-md-description fort-reular placeholder:text-[#919191]"
          />
        </div>

        <div className="space-y-3">
          <span className="text-title-sb-button font-semibold">내용</span>
          <textarea
            placeholder="내용을 작성해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-[1px] border-[#C3C3C3] rounded-[12px] px-4 py-3 h-[70px] text-body-md-description fort-reular placeholder:text-[#919191]"
          />
        </div>

        <div className="space-y-3">
          <span className="text-title-sb-button font-semibold">
            사진을 추가해주세요
          </span>
          <span className="text-[#919191]">(선택/최대 3장)</span>
          <ImageUploader images={images} setImages={setImages} />
        </div>
      </div>

      <div className="mx-5">
        <button
          disabled={!isValid}
          onClick={handleSubmit}
          className={`py-4 w-full mb-8 rounded-[12px] text-[#919191] text-[16px] font-semibold ${
            isValid ? 'bg-[#65CE58] text-[#FFFFFF]' : 'bg-[#E6E6E6]'
          }`}
        >
          등록하기
        </button>
      </div>

       {showToast &&
        createPortal(
          <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50">
            <ConfirmToast
              text="게시글 등록이 완료되었어요"
            />
          </div>,
          document.body,
        )}

    </div>
  );
}
