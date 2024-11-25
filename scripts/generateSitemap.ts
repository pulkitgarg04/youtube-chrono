import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

(async () => {
  const sitemap = new SitemapStream({ hostname: 'https://youtube-chrono.vercel.app' });

  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
  ];

  links.forEach((link) => sitemap.write(link));
  sitemap.end();

  const sitemapBuffer = await streamToPromise(sitemap);
  createWriteStream('./public/sitemap.xml').write(sitemapBuffer);

  console.log('Sitemap generated!');
})();