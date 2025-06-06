/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  basePath: '/vtt-subtitle-translator',
  assetPrefix: '/vtt-subtitle-translator',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
