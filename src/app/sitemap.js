export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://vimexmx.com'

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${base}/acerca-de-vimex`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
