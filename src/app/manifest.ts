import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Valuation App',
    short_name: 'Valuation',
    description: 'Offline-first Valuation Calculation Engine',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#005CB9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
