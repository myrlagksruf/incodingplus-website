const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  sassOptions:{
    includePaths:[path.join(__dirname, 'app')]
  }
}

module.exports = nextConfig
