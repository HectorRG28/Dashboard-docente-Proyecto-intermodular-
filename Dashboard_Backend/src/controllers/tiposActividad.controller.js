const pool = require('../db/pool.js');

exports.getTipos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tipo_actividad');
        res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error obteniendo tipos', error });
    }
};