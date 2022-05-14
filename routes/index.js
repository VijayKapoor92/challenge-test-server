const categorias = require("./categorias");
const produtos = require("./produtos");

module.exports = app => {
  app.use("/api/categorias", categorias);
  app.use("/api/produtos", produtos);
};