const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const db = require("../db");

const queries = require("../queries");

const router = new Router();

router.get("/", async (_, res) => {
  const { rows } = await db.query(queries.produtos.getAll);
  const payload = rows.map(r => {
    r.vl_produto = r.vl_produto.toString().replace(".", ",");
    return r;
  })
  res.status(200).send(payload);
});

router.post("/", async (req, res) => {
  let vl_produto = req.body.vl_produto;
  
  if (vl_produto.includes(","))
    vl_produto = vl_produto.replace(",", ".");

  const params = [
    req.body.nm_produto,
    req.body.qt_produto,
    vl_produto,
    req.body.id_categoria
  ]

  const { rows } = await db.query(queries.produtos.insert, params);
  res.status(201).send(rows[0]);
});

router.put("/:id", async (req, res) => {
  const id_produto = req.params.id;
  
  const params = [
    req.body.nm_produto,
    req.body.qt_produto,
    req.body.vl_produto,
    req.body.id_categoria,
    id_produto
  ];
  
  const { rows } = await db.query(queries.produtos.update, params);
  res.status(200).send(rows);
});

router.delete("/:id", async (req, res) => {
  const id_produto = req.params.id;
  const { rows } = await db.query(queries.produtos.delete, [id_produto]);
  res.status(200).send(rows[0]);
});

router.post("/import", upload.single("file"), async (req, res) => {
  const file = req.file;

  let data = JSON.parse(fs.readFileSync(file.path));
  if (!data.length)
    return res.send({
      status: -1,
      message: "Arquivo sem dados.",
      payload: []
    });
  
  let payload = [];
  let i = 0;

  while(i < data.length) {
    try {
      const produto = data[i];
    
      const id_categoria = req.body.id_categoria;

      let vl_produto = produto.vl_produto;
      if (vl_produto.includes(","))
        vl_produto = vl_produto.replace(",", ".");

      const params = [
        produto.nm_produto,
        parseInt(produto.qt_produto, 10),
        parseFloat(vl_produto),
        id_categoria
      ];

      const { rows } = await db.query(queries.produtos.import, params);
      payload.push(rows[0]);
    } catch(err) {
      console.error(err);
      return res.status(200).send({
        status: -1,
        message: "Error"
      });
    }

    i++;
  }
  
  res.status(201).send({
    status: 1,
    message: "Produtos importados com sucesso!",
    payload
  });
});

module.exports = router;