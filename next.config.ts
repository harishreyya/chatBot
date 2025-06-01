// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// -----------
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [
        ...(config.snapshot?.managedPaths || []),
        'C:\\Users\\haris\\Application Data',
        'C:\\Users\\haris\\Cookies',
      ],
    };

    config.watchOptions = {
      ignored: [
        '**/node_modules',
        'C:/Users/haris/Application Data',
        'C:/Users/haris/Cookies',
      ],
    };

    return config;
  },
};

export default nextConfig;
