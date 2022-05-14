const categorias = require("./categorias");

module.exports = app => {
  app.use("/api/categorias", categorias);
};