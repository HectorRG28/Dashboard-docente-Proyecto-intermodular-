const pool = require('./src/db/pool');

async function updateSchema() {
    try {
        console.log('🔄 Actualizando esquema de base de datos...');
        
        // 1. Añadir columna token_recuperacion
        try {
            await pool.query('ALTER TABLE usuario ADD COLUMN token_recuperacion VARCHAR(255) DEFAULT NULL');
            console.log('✅ Columna token_recuperacion añadida.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ Columna token_recuperacion ya existe.');
            else throw e;
        }

        // 2. Añadir columna token_expiracion
        try {
            await pool.query('ALTER TABLE usuario ADD COLUMN token_expiracion DATETIME DEFAULT NULL');
            console.log('✅ Columna token_expiracion añadida.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ Columna token_expiracion ya existe.');
            else throw e;
        }

        console.log('🎉 Esquema actualizado correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error actualizando esquema:', error);
        process.exit(1);
    }
}

updateSchema();
