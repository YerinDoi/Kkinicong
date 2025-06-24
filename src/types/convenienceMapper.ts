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
