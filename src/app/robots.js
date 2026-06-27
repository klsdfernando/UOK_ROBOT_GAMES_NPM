export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/x-admin-portal-2026/",
          "/login/",
          "/forgot-password/",
        ],
      },
    ],
    sitemap: "https://robotgames.ecsc-uok.com/sitemap.xml",
    host: "https://robotgames.ecsc-uok.com",
  };
}
