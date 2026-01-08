import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Si tuvieras panel de admin, lo bloqueás acá
    },
    sitemap: 'https://celdoctor.com/sitemap.xml',
  }
}