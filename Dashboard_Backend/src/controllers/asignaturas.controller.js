const pool = require('../db/pool');

const getAll = async (req, res) => {
  try {
    // Pedimos ID, Nombre y Color para pintar luego el selector bonito
    const [rows] = await pool.query('SELECT id_asignatura, nombre, color FROM asignatura');
    res.json({ ok: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Error al cargar asignaturas' });
  }
};

module.exports = { getAll };