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
        'main-color': '#65CE58',
      },
      boxShadow: {
        'custom': '0px 4px 8px 0px rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [scrollbarHide],
};

export default config;
