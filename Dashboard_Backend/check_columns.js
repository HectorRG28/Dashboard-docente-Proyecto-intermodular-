const mysql = require("mysql2/promise");
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = require("./src/db/config");

async function checkColumns() {
  try {
    const pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
    });

    const [rows] = await pool.query(`SHOW COLUMNS FROM actividad_evaluable`);
    console.log(
      "Columns in activity_evaluable:",
      rows.map((r) => r.Field),
    );
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkColumns();
