const config_ts = require(`/scratch-auth.config.ts`).default;

const config = config_ts;

if (!config) {
  throw new Error("Invalid config");
}

export default {
  COOKIE_NAME: "_scratch-auth-session", // Cookieの名前を指定
  redirect_url: config.redirect_url || "https://localhost:3000/api/auth",
  title: config.title || "Scratch Auth",
  expiration: config.expiration || 30,
  cn: config.cn || null,
  debug: config.debug || false,
};
