import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const SITE_URL = 'https://kkinicong.co.kr';

// 실제 노출할 경로들
const routes = [
  '/', 
  '/store-map', 
  '/store-search', 
  '/convenience',
  '/community',
  '/login'
];

async function run() {
  const sitemap = new SitemapStream({ hostname: SITE_URL });
  const writeStream = createWriteStream(resolve('public', 'sitemap.xml'));

  routes.forEach((path) => {
    sitemap.write({
      url: path,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.7
    });
  });

  sitemap.end();
  const data = await streamToPromise(sitemap);
  writeStream.write(data);
  writeStream.end();
  console.log('✅ sitemap.xml generated at /public/sitemap.xml');
}

run();
