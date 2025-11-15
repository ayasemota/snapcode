import { withPWA } from "next-pwa";
import runtimeCaching from "next-pwa/cache";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: "public",
    disable: !isProd,
    register: true,
    skipWaiting: true,
    runtimeCaching,
  },
});
