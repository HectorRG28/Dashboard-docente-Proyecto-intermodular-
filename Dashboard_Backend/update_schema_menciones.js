const pool = require('./src/db/pool');

async function updateSchema() {
  try {
    console.log('--- Configurando tabla de Menciones ---');

    console.log('1. Creando tabla "actividad_mencion" si no existe...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS actividad_mencion (
        id_mencion int(11) NOT NULL AUTO_INCREMENT,
        id_actividad int(11) NOT NULL,
        id_docente int(11) NOT NULL,
        created_at timestamp NULL DEFAULT current_timestamp(),
        PRIMARY KEY (id_mencion),
        KEY fk_am_actividad (id_actividad),
        KEY fk_am_docente (id_docente),
        CONSTRAINT fk_am_actividad FOREIGN KEY (id_actividad) REFERENCES actividad_evaluable (id_actividad) ON DELETE CASCADE,
        CONSTRAINT fk_am_docente FOREIGN KEY (id_docente) REFERENCES usuario (id_usuario) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    console.log('✅ Tabla "actividad_mencion" lista.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error configurando menciones:', error);
    process.exit(1);
  }
}

updateSchema();
