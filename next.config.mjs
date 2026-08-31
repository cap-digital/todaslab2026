/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Segmentação oculta até segunda ordem — para restaurar, remova este
      // redirect e reative o item "Segmentação" no NAV (components/painel-chrome.tsx).
      {
        source: "/painel/segmentacao",
        destination: "/painel/desempenho",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
