const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
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

  RETURNING *
  `;

  let vl_produto = req.body.vl_produto;
  if (vl_produto.includes(","))
    vl_produto = vl_produto.replace(",", ".");

  const params = [
    req.body.nm_produto,
    req.body.qt_produto,
    vl_produto,
    req.body.id_categoria
  ]

  const { rows } = await db.query(query, params);
  res.status(201).send(rows[0]);
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
  res.status(200).send(rows[0]);
});

router.post("/import", upload.single("file"), async (req, res) => {
  const file = req.file;

  let data = JSON.parse(fs.readFileSync(file.path));
  if (!data.length)
    res.send({
      status: -1,
      message: "Arquivo sem dados.",
      payload: []
    });
  
  let payload = [];
  let i = 0;
  while(i < data.length) {
    const produto = data[i];
    try {
      const query = `
      INSERT INTO produtos 
      (nm_produto, qt_produto, vl_produto, id_categoria) 
      (SELECT $1 AS nm_produto, 
              $2 AS qt_produto, 
              $3 AS vl_produto, 
              (SELECT id_categoria from categorias WHERE LOWER(nm_categoria) = LOWER($4)) AS id_categoria
      )

      RETURNING *
      `;

      let vl_produto = produto.vl_produto;
      if (vl_produto.includes(","))
        vl_produto = vl_produto.replace(",", ".");

      const params = [
        produto.nm_produto,
        produto.qt_produto,
        vl_produto,
        produto.nm_categoria
      ]

      const { rows } = await db.query(query, params);
      payload.push(rows[0]);
      i++;
    } catch(err) {
      console.error(err);
    }
  }
  
  res.status(201).send({
    status: 1,
    message: "Produtos importados com sucesso!",
    payload
  });
});

router.post("/:id/export", async (req, res) => {
  try {
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
      AND cat.id_categoria = $1
    `;
    const { rows } = await db.query(query, [req.params.id]);
    res.status(200).send({
      status: 1,
      message: "",
      payload: rows
    });
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;