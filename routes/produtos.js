const { Router } = require("express");
const db = require("../db");

const router = new Router();

router.get("/", async (req, res) => {
  const query = `
  SELECT pro.id_produto,
         pro.nm_produto,
         pro.qt_produto,
         pro.vl_produto,
         pro.id_categoria,
         cat.nm_categoria
    FROM produtos pro,
         categorias cat
   WHERE pro.id_categoria = cat.id_categoria
  `;
  const { rows } = await db.query(query);
  res.status(200).send(rows);
});

router.post("/", async (req, res) => {
  const query = `
  INSERT INTO produtos 
  (nm_produto, qt_produto, vl_produto, id_categoria) 
  VALUES 
  ($1, $2, $3, $4)
  `;

  const params = [
    req.body.nm_produto,
    req.body.qt_produto,
    req.body.vl_produto,
    req.body.id_categoria
  ]

  const { rows } = await db.query(query, params);
  res.status(200).send(rows);
});

router.put("/:id", async (req, res) => {
  const id_produto = req.params.id;
  const query = `
  UPDATE produtos 
     SET nm_produto = $1,
         qt_produto = $2,
         vl_produto = $3,
         id_categoria = $4
   WHERE id_produto = $5
  RETURNING *
  `;
  const params = [
    req.body.nm_produto,
    req.body.qt_produto,
    req.body.vl_produto,
    req.body.id_categoria,
    id_produto
  ];
  
  const { rows } = await db.query(query, params);
  res.status(200).send(rows);
});

router.delete("/:id", async (req, res) => {
  const id_produto = req.params.id;
  const { rows } = await db.query("DELETE FROM produtos WHERE id_produto = $1", [id_produto]);
  res.status(200).send(rows);
});

module.exports = router;