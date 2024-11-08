/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://scratch-auth.onrender.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["*/_meta"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api"],
      },
    ],
  },
};
