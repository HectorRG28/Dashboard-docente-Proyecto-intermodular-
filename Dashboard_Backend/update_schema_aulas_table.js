const pool = require('./src/db/pool');

async function updateSchema() {
  try {
    console.log('--- Configurando tabla de Aulas (Pool de 42) ---');

    console.log('1. Creando tabla "aulas" si no existe...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS aulas (
        id_aula int(11) NOT NULL AUTO_INCREMENT,
        nombre varchar(50) NOT NULL,
        PRIMARY KEY (id_aula)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    console.log('2. Verificando aulas existentes...');
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM aulas');
    const count = rows[0].count;

    if (count === 0) {
        console.log('3. Insertando 42 aulas...');
        const values = [];
        for (let i = 1; i <= 42; i++) {
            values.push([`Aula ${i}`]);
        }
        await pool.query('INSERT INTO aulas (nombre) VALUES ?', [values]);
        console.log('✅ 42 Aulas insertadas.');
    } else {
        console.log(`ℹ️ Ya existen ${count} aulas. Se omite inserción.`);
    }

    console.log('--- Configuración completada ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error configurando aulas:', error);
    process.exit(1);
  }
}

updateSchema();
