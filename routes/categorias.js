const { Router } = require("express");
const db = require("../db");

const router = new Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM categorias");
  res.status(200).send(rows);
});

router.post("/", async (req, res) => {
  const query = "INSERT INTO categorias (nm_categoria) VALUES ($1)";
  const { rows } = await db.query(query, [req.body.nm_categoria]);
  res.status(200).send(rows);
});
module.exports = router;