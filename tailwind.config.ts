// prettier-ignore
import type { Config } from 'tailwindcss';
import scrollbarHide from 'tailwind-scrollbar-hide';
import lineClamp from '@tailwindcss/line-clamp';

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
        'main-color': '#65CE58',
      },
      boxShadow: {
        custom: '2px 4px 10px 0px rgba(0, 0, 0, 0.20)',
        bottom: '0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
        floating: '0px 0px 8px 0px rgba(0, 0, 0, 0.25)'
      },
      fontSize: {
        'headline-sb-main'    : ['20px', { lineHeight: '32px', letterSpacing: '0' }],
        'title-sb-button'     : ['16px', { lineHeight: '20px', letterSpacing: '0' }],
        'body-md-title'       : ['14px', { lineHeight: '24px', letterSpacing: '0' }],
        'body-md-description' : ['12px', { lineHeight: '16px', letterSpacing: '0.1px' }],
        'body-bd-title'       : ['16px', { lineHeight: '24px', letterSpacing: '0.1px' }],
      },      
      fontWeight: {
        normal: '400',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [scrollbarHide, lineClamp]

};

export default config;
