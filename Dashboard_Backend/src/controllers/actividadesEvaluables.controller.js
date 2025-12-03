const { pool } = require('../db/pool.js');

exports.createActividad = async (req, res) => {
    try {
        const { 
            titulo, descripcion, fecha_inicio, fecha_fin, 
            id_tipo, id_estado, id_asignacion, creado_por,
            peso, id_periodo      
        } = req.body;

        if (!titulo || !id_asignacion || !id_tipo) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const [rows] = await pool.query(
            `INSERT INTO actividad_evaluable 
            (titulo, descripcion, fecha_inicio, fecha_fin, id_tipo, id_estado, id_asignacion, creado_por, peso, id_periodo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                titulo, descripcion, fecha_inicio, fecha_fin, 
                id_tipo, id_estado, id_asignacion, creado_por, 
                peso || 0, id_periodo || null 
            ]
        );

        res.json({ id: rows.insertId, titulo, message: 'Actividad creada' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno', error });
    }
};

exports.getActividades = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM actividad_evaluable');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error obteniendo actividades', error });
    }
};

// FUNCIÓN PARA BORRAR 
exports.deleteActividad = async (req, res) => {
    try {
        const { id } = req.params; // Recibimos el ID por la URL
        const [result] = await pool.query('DELETE FROM actividad_evaluable WHERE id_actividad = ?', [id]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Actividad no encontrada' });
        }

        res.sendStatus(204); // 204 significa "Borrado OK, sin contenido"
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar', error });
    }
};