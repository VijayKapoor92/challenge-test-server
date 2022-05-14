const { Router } = require("express");
const db = require("../db");

const router = new Router();

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM categorias");
  res.status(200).send(rows);
});

module.exports = router;