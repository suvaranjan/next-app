// import { withContentlayer } from "next-contentlayer2";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   // Remove swcMinify (no longer needed)
// };

// export default withContentlayer(nextConfig);

import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "canvas"];
    }
    return config;
  },
};

export default withContentlayer(nextConfig);
