const Router = require("express-promise-router");
const db = require("../db");

const queries = require("../queries");
const router = new Router();

module.exports = router;

router.get("/", async (_, res) => {
  const { rows } = await db.query(queries.categorias.getAll);
  res.status(200).send(rows);
});

router.post("/", async (req, res) => {
  const { rows } = await db.query(queries.categorias.insert, [req.body.nm_categoria]);
  
  let payload = rows[0];
  payload.tl_produtos = 0;

  res.status(201).send(rows);
});

router.put("/:id", async (req, res) => {
  const id_categoria = req.params.id;
  const nm_categoria = req.body.nm_categoria;

  const { rows } = await db.query(queries.categorias.update, [nm_categoria, id_categoria]);
  res.status(200).send(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const id_categoria = req.params.id;
  const { rows } = await db.query(queries.categorias.delete, [id_categoria]);
  res.status(200).send(rows);
});

router.post("/:id/export", async (req, res) => {
  try {
    const { rows } = await db.query(queries.categorias.export, [req.params.id]);
    res.status(200).send({
      status: 1,
      message: "",
      payload: rows
    });
  } catch(err) {
    console.error(err);
  }
});