// prettier-ignore
import type { Config } from 'tailwindcss';
import scrollbarHide from 'tailwind-scrollbar-hide';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/styles/main.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        'main-color': '#65CE58', // 이미 추가된 색상
      },
      boxShadow: {
        custom: '0px 4px 8px rgba(0, 0, 0, 0.10)',
      },
      fontSize: {
        'headline-sb-main'    : ['20px', { lineHeight: '32px', letterSpacing: '0' }],
        'title-sb-button'     : ['16px', { lineHeight: '20px', letterSpacing: '0' }],
        'body-md-title'       : ['14px', { lineHeight: '18px', letterSpacing: '0' }],
        'body-md-description' : ['12px', { lineHeight: '16px', letterSpacing: '0.1px' }],
        'body-bd-title'       : ['16px', { lineHeight: '24px', letterSpacing: '0.1px' }],
      },      
      fontWeight: {
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [scrollbarHide],
};

export default config;
