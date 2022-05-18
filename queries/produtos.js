module.exports = {
  getAll: `SELECT pro.id_produto, pro.nm_produto, pro.qt_produto, pro.vl_produto, pro.id_categoria, cat.nm_categoria FROM produtos pro, categorias cat WHERE pro.id_categoria = cat.id_categoria`,
  
  insert: `INSERT INTO produtos (nm_produto, qt_produto, vl_produto, id_categoria) VALUES ($1, $2, $3, $4) RETURNING *`,
  
  update: `UPDATE produtos SET nm_produto = $1, qt_produto = $2, vl_produto = $3, id_categoria = $4 WHERE id_produto = $5 RETURNING *`,
  
  delete: `DELETE FROM produtos WHERE id_produto = $1`,

  import: `
  WITH old AS (
    SELECT $1::text AS nm_produto, 
           $2::integer AS qt_produto, 
           $3::numeric AS vl_produto, 
           $4::integer AS id_categoria,
           (SELECT nm_categoria FROM categorias WHERE id_categoria = $4::integer)
  ),
  new AS (
    INSERT INTO produtos
    (nm_produto, qt_produto, vl_produto, id_categoria)
    (SELECT nm_produto, qt_produto, vl_produto, id_categoria FROM old)
  )
  SELECT * FROM old;
  `
}