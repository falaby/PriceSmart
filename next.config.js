/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  images: {
    domains: ['supabase.co'],
  },
}

module.exports = nextConfig
