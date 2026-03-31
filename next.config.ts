import path from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  }
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname)
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/:path*",
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true
      },
      {
        source: "/sobre.html",
        destination: "/sobre",
        permanent: true
      },
      {
        source: "/solucoes.html",
        destination: "/solucoes",
        permanent: true
      },
      {
        source: "/projeto.html",
        destination: "/projeto",
        permanent: true
      },
      {
        source: "/aracatuba.html",
        destination: "/ecopontos",
        permanent: true
      },
      {
        source: "/contato-ou-fontes.html",
        destination: "/fontes",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
