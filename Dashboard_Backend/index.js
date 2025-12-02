const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONEXIÓN A LA BASE DE DATOS
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dashboard_docente'
});

db.connect(err => {
  if (err) console.error('❌ Error conectando a la BD:', err);
  else console.log('✅ Conectado a la base de datos MySQL');
});

// RUTA PARA OBTENER ACTIVIDADES
app.get('/api/actividades', (req, res) => {
  const sql = `
    SELECT 
      ae.id_actividad, 
      ae.titulo, 
      ae.descripcion, 
      ae.fecha_inicio, 
      ae.fecha_fin, 
      asi.nombre as nombre_asignatura,
      asi.color as color_asignatura
    FROM actividad_evaluable ae
    JOIN asignacion_docente ad ON ae.id_asignacion = ad.id_asignacion
    JOIN asignatura asi ON ad.id_asignatura = asi.id_asignatura
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// ARRANCAR EL SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend listo en http://localhost:${PORT}`);
});