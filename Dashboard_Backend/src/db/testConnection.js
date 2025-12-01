// src/db/testConnection.js
// ----------------------------------------------------------
// Este archivo sirve para probar la conexión a la base de datos.
// Se ejecuta con el comando:
//   npm run test-connection
//
// Si todo va bien, mostrará un mensaje por consola indicando
// que la conexión a MySQL y a la base de datos es correcta.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;      // Pool de conexiones
let testQuery; // Consulta de prueba
let main;      // Función principal

// 2. ASIGNACIONES
pool = require('./pool');             // Importamos el pool de conexiones
testQuery = 'SELECT 1 AS resultado';  // Consulta SQL muy simple

// Definimos la función principal que ejecutará la prueba.
main = async function () {
  let result;  // Resultado devuelto por la consulta
  let rows;    // Filas devueltas

  try {
    // Ejecutamos la consulta usando async/await.
    result = await pool.query(testQuery);
    rows = result[0];

    console.log('---------------------------------------------');
    console.log('Test de conexión a la base de datos');
    console.log('Conexión correcta a MySQL y a la BD dashboard_docente.');
    console.log('Resultado de la consulta de prueba:', rows[0]);
    console.log('---------------------------------------------');

    // Cerramos el pool de conexiones de forma ordenada.
    await pool.end();
  } catch (error) {
    console.error('---------------------------------------------');
    console.error('Error al conectar con la base de datos:');
    console.error(error);
    console.error('---------------------------------------------');

    // Intentamos cerrar el pool aunque haya error.
    try {
      await pool.end();
    } catch (endError) {
      console.error('Error al cerrar el pool:', endError);
    }
  }
};

// 3. EJECUCIÓN
main();
