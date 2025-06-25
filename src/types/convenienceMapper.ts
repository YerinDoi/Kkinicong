// utils/convenienceMapper.ts

export const toServerCategory = (label: string): string | undefined => {
  const map: Record<string, string> = {
    식사류: 'MEAL',
    간식류: 'SNACK',
    음료: 'DRINK',
    과일류: 'FRUIT',
    기타: 'ETC',
  };
  return map[label];
};

export const toServerBrand = (label: string): string | undefined => {
  const map: Record<string, string> = {
    GS25: 'GS25',
    CU: 'CU',
    세븐일레븐: 'SEVEN_ELEVEN',
    이마트24: 'EMART_24',
    미니스톱: 'MINI_STOP',
  };
  return map[label];
};

// 영어 → 한글: 카테고리
export const fromServerCategory = (code: string): string => {
  const map: Record<string, string> = {
    MEAL: '식사류',
    SNACK: '간식류',
    DRINK: '음료',
    FRUIT: '과일류',
    ETC: '기타',
  };
  return map[code] || code;
};

// 영어 → 한글: 브랜드
export const fromServerBrand = (code: string): string => {
  const map: Record<string, string> = {
    GS25: 'GS25',
    CU: 'CU',
    SEVEN_ELEVEN: '세븐일레븐',
    EMART_24: '이마트24',
    MINI_STOP: '미니스톱',
  };
  return map[code] || code;
};
