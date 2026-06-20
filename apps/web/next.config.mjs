/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // contracts paketi kaynaktan tüketilir (build adımı yok) → Next transpile eder.
  transpilePackages: ["@heimdall/contracts"],
};

export default nextConfig;
