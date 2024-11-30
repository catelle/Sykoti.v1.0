/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        // Matches the '/list' and its subroutes like '/list/astuces', '/list/testimony'
        urlPattern: /^\/list(\/.*)?$/,  // This matches /list, /list/astuces, /list/testimony
        handler: 'NetworkFirst', // Use NetworkFirst strategy (try network, then fallback to cache)
        options: {
          cacheName: 'list-pages-cache', // Cache name
          expiration: {
            maxEntries: 50,  // Limit the number of cached entries
            maxAgeSeconds: 60 * 60 * 24,  // Cache for 1 day
          },
        },
      },
      {
        // Matches the '/student' route
        urlPattern: /^\/student$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'student-page-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24,
          },
        },
      },
      {
        urlPattern: /\/img\/.*\.(?:png|jpg|jpeg|svg|gif)$/, // Matches images in /public/img folder
        handler: 'CacheFirst', // Cache the images, use the cache first
        options: {
          cacheName: 'image-cache', // Custom cache name for images
          expiration: {
            maxEntries: 100, // Limit the number of cached images
            maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
          },
        },
      }
      
    ],
  },
    customWorkerSrc: "service-worker",
    customWorkerDest: "dest", // defaults to `dest`
    customWorkerPrefix: "not/a-worker",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/sykoti.appspot.com/**',
      },
    ],
  },
 
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint checks during builds
  },
  reactStrictMode: true, // Keep this if you need strict mode enabled
  // any other Next.js config options you may need
};

// Apply the PWA configuration to the nextConfig object
export default withPWA(nextConfig);
