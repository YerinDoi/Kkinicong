import { createContext } from 'react';

interface KakaoMapContextType {
  kakao: any;
}

export const KakaoMapContext = createContext<KakaoMapContextType | null>(null);
