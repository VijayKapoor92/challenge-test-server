module.exports = {
  getAll: `SELECT pro.id_produto, pro.nm_produto, pro.qt_produto, pro.vl_produto, pro.id_categoria, cat.nm_categoria FROM produtos pro, categorias cat WHERE pro.id_categoria = cat.id_categoria`,
  
  insert: `INSERT INTO produtos (nm_produto, qt_produto, vl_produto, id_categoria) VALUES ($1, $2, $3, $4) RETURNING *`,
  
  update: `UPDATE produtos SET nm_produto = $1, qt_produto = $2, vl_produto = $3, id_categoria = $4 WHERE id_produto = $5 RETURNING *`,
  
  delete: `DELETE FROM produtos WHERE id_produto = $1`,

  importByName: `INSERT INTO produtos (nm_produto, qt_produto, vl_produto, id_categoria) (SELECT $1 AS nm_produto, $2 AS qt_produto, $3 AS vl_produto, (SELECT id_categoria from categorias WHERE LOWER(nm_categoria) = LOWER($4)) AS id_categoria) RETURNING *`,

  importById: `INSERT INTO produtos (nm_produto, qt_produto, vl_produto, id_categoria) (SELECT $1 AS nm_produto, $2 AS qt_produto, $3 AS vl_produto, $4 AS id_categoria) RETURNING *`
}