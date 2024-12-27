const mysql = require('mysql2/promise');

let pool;

/**
 * Retorna un pool de conexiones a la base de datos.
 * Si no existe, lo crea, para luego reusarlo.
 */
async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

module.exports = {
  getPool,
};
