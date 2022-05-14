const { Pool } = require("pg");

const pool = new Pool();

module.exports = {
  query: (text, params) => {
    console.log("Query executed - " + (new Date()) );
    return pool.query(text, params)
  }
}