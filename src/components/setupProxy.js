const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/explorer/account/", {
      target: "https://api.tzstats.com",
      secure: false,
      changeOrigin: true,
    })
  );

  app.use(
    proxy("/tables/income", {
      target: "https://api.tzstats.com",
      secure: false,
      changeOrigin: true,
    })
  );
};
