/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
}
