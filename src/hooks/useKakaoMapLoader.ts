import { useKakaoLoader as KakaoMapLoader } from 'react-kakao-maps-sdk';

const useKakaoMapLoader = () => {
    const [ loading, error ] = KakaoMapLoader({
        appkey: import.meta.env.VITE_KAKAO_APP_KEY,
        libraries: ['services'],
    });

    // 로딩 중이면 로딩 상태 반환
    if (loading) {
        return { loading: true, error: false, kakao: null };
    }

    // 에러가 발생하면 에러 상태 반환
    if (error) {
        return { loading: false, error: true, kakao: null };
    }

    // 로딩이 완료되면 카카오 맵 객체 반환
    return { kakao: window.kakao, loading: false, error: false };
};

export default useKakaoMapLoader;