/**
 * StadiumMind AI - FIFA 2026 Smart Stadium Platform
 * SEO Robots rule configuration representation
 */

export interface RobotsConfig {
  rules: {
    userAgent: string;
    allow?: string | string[];
    disallow?: string | string[];
  }[];
  sitemap?: string;
}

export default function robots(): RobotsConfig {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/private/*', '/admin/*'],
      },
    ],
    sitemap: 'https://stadiummind.example.com/sitemap.xml',
  };
}
