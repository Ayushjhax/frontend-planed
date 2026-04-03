import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: frontendRoot,
  turbopack: {
    root: frontendRoot,
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      tailwindcss: path.join(frontendRoot, "node_modules/tailwindcss"),
      "@tailwindcss/postcss": path.join(
        frontendRoot,
        "node_modules/@tailwindcss/postcss"
      ),
    };
    config.resolve.modules = [
      path.join(frontendRoot, "node_modules"),
      ...(config.resolve.modules ?? []),
    ];

    return config;
  },
};

export default nextConfig;
