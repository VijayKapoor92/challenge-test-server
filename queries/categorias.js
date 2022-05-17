module.exports = {
  getAll: `SELECT cat.id_categoria, cat.nm_categoria, (SELECT COUNT(*) FROM produtos WHERE id_categoria = cat.id_categoria) AS tl_produtos FROM categorias cat`,
  
  insert: `INSERT INTO categorias (nm_categoria) VALUES ($1) RETURNING *`,
  
  update: `UPDATE categorias SET nm_categoria = $1 WHERE id_categoria = $2 RETURNING *`,
  
  delete: `DELETE FROM categorias WHERE id_categoria = $1`,

  export: `SELECT pro.id_produto, pro.nm_produto, pro.qt_produto, pro.vl_produto, pro.id_categoria, cat.nm_categoria FROM produtos pro, categorias cat WHERE pro.id_categoria = cat.id_categoria AND cat.id_categoria = $1`
}