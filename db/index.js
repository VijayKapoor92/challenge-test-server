const { Pool } = require("pg");

const pool = new Pool();

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

pool.connect((err, client, done) => {
  done()
  if (err) throw err

  client.query("SELECT * FROM CATEGORIAS", (err, res) => {
    if (!res) {
      client.query("create table categorias (id_categoria SERIAL primary key, nm_categoria VARCHAR(50) not null);");
      client.query("create table produtos (id_produto SERIAL primary key, nm_produto VARCHAR(100) not null, qt_produto INTEGER default 0, vl_produto NUMERIC(9, 2) not null, id_categoria INTEGER not null, constraint fk_categoria foreign key(id_categoria) references categorias(id_categoria))");
    }
  })
});

module.exports = {
  query: (text, params) => {
    console.log("Query executed - " + (new Date()) );
    return pool.query(text, params)
  }
}