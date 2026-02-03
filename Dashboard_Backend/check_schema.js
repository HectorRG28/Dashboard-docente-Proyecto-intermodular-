const pool = require('./src/db/pool');

async function checkSchema() {
    try {
        const [rows] = await pool.query('SELECT * FROM usuario LIMIT 1');
        console.log('✅ Tabla usuario encontrada. Registros:', rows.length);
        console.log('Datos:', rows);
    } catch (error) {
        console.error('❌ Error consultando tabla usuarios:', error.code, error.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
