const pool = require('../db/pool.js');

exports.getModulos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM modulo');
        res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error obteniendo módulos', error });
    }
};