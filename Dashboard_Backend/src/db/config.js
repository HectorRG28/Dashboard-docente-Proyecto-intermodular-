// src/db/config.js
// ----------------------------------------------------------
// Este archivo define la configuración de conexión a MySQL.
// No abre conexiones, solo guarda los datos necesarios para
// que otros módulos (como pool.js) se conecten a la base de datos.
// ----------------------------------------------------------

// 1. DECLARACIONES
let dbConfig;   // Objeto con los parámetros de conexión a la base de datos

// 2. ASIGNACIONES
// IMPORTANTE: ajusta 'user' y 'password' a tu entorno real.
// En muchos XAMPP: user: 'root', password: '' (cadena vacía).
dbConfig = {
  host: 'localhost',            // Servidor MySQL
  port: 3306,                   // Puerto MySQL
  user: 'root',                 // Usuario MySQL
  password: '',                 // Contraseña del usuario MySQL
  database: 'dashboard_docente' // Nombre de la base de datos
};

// 3. EXPORTACIONES
module.exports = dbConfig;
