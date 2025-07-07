import axios from '@/api/axiosInstance';

export const uploadImages = async (postId: string, images: File[]): Promise<string[]> => {
  const formData = new FormData();
  images.forEach((img) => formData.append('files', img));

  try {
    const res = await axios.post(`/api/v1/community/post/${postId}/image`, formData);
    console.log('uploadImages 응답:', res.data.results);

    const uploaded = res.data?.results?.imageUrls;

    if (!Array.isArray(uploaded)) {

      console.error('imageUrls 응답 이상함:', uploaded);
      return [];
    }

    return uploaded;
  } catch (error: any) {
    console.error('이미지 업로드 실패:', error?.response || error?.message || error);
    return [];
  }
};
