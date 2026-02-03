const { createPool } = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('./config.js');

const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});

// Mensaje de conexión opcional
pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('✅ Base de datos conectada correctamente');
    })
    .catch(error => {
        console.error('❌ Error conectando a la base de datos:', error.code);
    });

module.exports = pool;