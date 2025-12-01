// src/db/pool.js
// ----------------------------------------------------------
// Este archivo crea un "pool" de conexiones a MySQL utilizando
// la librería mysql2. El pool es un conjunto de conexiones que
// se reutilizan para mejorar el rendimiento.
// ----------------------------------------------------------

// 1. DECLARACIONES
let mysql;        // Paquete mysql2
let dbConfig;     // Configuración de conexión
let pool;         // Pool de conexiones básico
let poolPromise;  // Pool en versión promesa (para usar async/await)

// 2. ASIGNACIONES
mysql = require('mysql2');       // Cargamos el paquete mysql2
dbConfig = require('./config');  // Cargamos la configuración de conexión

// Creamos el pool de conexiones usando la configuración.
pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convertimos el pool a versión "promesa" para poder usar async/await.
poolPromise = pool.promise();

// 3. EXPORTACIONES
module.exports = poolPromise;
