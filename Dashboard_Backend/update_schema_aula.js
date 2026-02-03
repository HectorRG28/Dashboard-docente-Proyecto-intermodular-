const pool = require('./src/db/pool');

async function updateSchema() {
  try {
    console.log('--- Iniciando actualización de esquema (campo aula) ---');

    console.log('Añadiendo columna "aula" a la tabla "actividad_evaluable"...');
    // Usamos ADD COLUMN IF NOT EXISTS (o try/catch si la versión de MySQL es vieja, pero esto suele ir bien)
    // MySQL estándar no soporta "IF NOT EXISTS" en ADD COLUMN directamente en versiones viejas, 
    // pero podemos intentarlo y capturar error, o consultar primero.
    // Lo más simple: intentar el ALTER y si falla porque existe, ignorar.
    
    try {
        await pool.query('ALTER TABLE actividad_evaluable ADD COLUMN aula VARCHAR(50) DEFAULT NULL AFTER descripcion');
        console.log('✅ Columna "aula" añadida correctamente.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️ La columna "aula" ya existe. No se hacen cambios.');
        } else {
            throw err;
        }
    }

    console.log('--- Actualización completada ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error actualizando el esquema:', error);
    process.exit(1);
  }
}

updateSchema();
