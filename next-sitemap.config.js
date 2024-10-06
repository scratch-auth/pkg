/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://scratch-auth.netlify.app",
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
