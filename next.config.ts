// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// next.config.js
import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, swcMinify: true };

module.exports = withContentlayer(nextConfig);

// import { withContentlayer } from "next-contentlayer2";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: false, // Keep this as `true` unless you encounter issues
//   experimental: {
//     turbo: {
//       resolveAlias: {
//         canvas: "./empty-module.ts", // Resolve canvas to an empty module
//       },
//     },
//   },
// };

// module.exports = withContentlayer(nextConfig);
