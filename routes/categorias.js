const Router = require("express-promise-router");
const db = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (_, res) => {
  const query = `
  SELECT cat.id_categoria,
         cat.nm_categoria,
         (select count(*) from produtos where id_categoria = cat.id_categoria) as tl_produtos
    FROM categorias cat
  `;
  const { rows } = await db.query(query);
  res.status(200).send(rows);
});

router.post("/", async (req, res) => {
  const query = "INSERT INTO categorias (nm_categoria) VALUES ($1) RETURNING *";
  const { rows } = await db.query(query, [req.body.nm_categoria]);
  res.status(201).send(rows);
});

router.put("/:id", async (req, res) => {
  const id_categoria = req.params.id;
  const query = "UPDATE categorias SET nm_categoria = $1 WHERE id_categoria = $2 RETURNING *";
  const { rows } = await db.query(query, [req.body.nm_categoria, id_categoria]);
  res.status(200).send(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const id_categoria = req.params.id;
  const { rows } = await db.query("DELETE FROM categorias WHERE id_categoria = $1", [id_categoria]);
  res.status(200).send(rows);
});