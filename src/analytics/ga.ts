import ReactGA from 'react-ga4';

let isInitialized = false;

export const initGA = () => {
  // 중복 초기화 방지
  if (isInitialized) {
    return;
  }

  ReactGA.initialize('G-MFJ749RKHH'); // 측정 ID
  isInitialized = true;
};

export const trackPageView = (path: string) => {
  if (!isInitialized) {
    console.warn('GA4가 초기화되지 않았습니다. initGA()를 먼저 호출하세요.');
    return;
  }
  ReactGA.send({ hitType: 'pageview', page: path });
};

// GA4 이벤트 추적 함수
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>,
) => {
  if (!isInitialized) {
    console.warn('GA4가 초기화되지 않았습니다. initGA()를 먼저 호출하세요.');
    return;
  }
  ReactGA.event(eventName, parameters);
};

// 검색 이벤트
export const trackSearchStore = (keyword: string, resultCount: number) => {
  trackEvent('search_store', {
    keyword,
    result_count: resultCount,
  });
};

// 가맹점 상세 페이지 조회
export const trackViewStoreDetail = (
  storeId: string | number,
  category: string,
  region?: string,
) => {
  trackEvent('view_store_detail', {
    store_id: String(storeId),
    category,
    ...(region && { region }),
  });
};

// 전화/지도 버튼 클릭
export const trackClickPhoneOrMap = (
  storeId: string | number,
  clickType: 'phone' | 'map',
) => {
  trackEvent('click_phone_or_map', {
    store_id: String(storeId),
    click_type: clickType,
  });
};

// 즐겨찾기/저장
export const trackSaveStore = (storeId: string | number) => {
  trackEvent('save_store', {
    store_id: String(storeId),
  });
};

// 공유 기능
export const trackShareStore = (
  storeId: string | number,
  shareChannel?: string,
) => {
  trackEvent('share_store', {
    store_id: String(storeId),
    ...(shareChannel && { share_channel: shareChannel }),
  });
};

// 카테고리 선택
export const trackOpenCategory = (categoryName: string) => {
  trackEvent('open_category', {
    category_name: categoryName,
  });
};

// 필터 적용
export const trackFilterSearch = (filterType: string, filterValue: string) => {
  trackEvent('filter_search', {
    filter_type: filterType,
    filter_value: filterValue,
  });
};

// 후기 섹션 열람
export const trackViewReview = (storeId: string | number) => {
  trackEvent('view_review', {
    store_id: String(storeId),
  });
};

// 리뷰 등록
export const trackSubmitReview = (
  storeId: string | number,
  rating: number,
  textLength: number,
) => {
  trackEvent('submit_review', {
    store_id: String(storeId),
    rating,
    text_length: textLength,
  });
};

// 스크롤 깊이
export const trackScrollDepth = (depthPercent: number) => {
  trackEvent('scroll_depth', {
    depth_percent: depthPercent,
  });
};

// 리텐션 측정
export const trackReturningUser = (daysBetweenVisits: number) => {
  trackEvent('returning_user', {
    days_between_visits: daysBetweenVisits,
  });
};
