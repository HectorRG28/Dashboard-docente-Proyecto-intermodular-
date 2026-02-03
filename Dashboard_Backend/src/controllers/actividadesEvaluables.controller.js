const model = require('../models/actividadesEvaluables.model');

exports.createActividad = async (req, res) => {
    try {
        const { 
            titulo, descripcion, aula, fecha_inicio, fecha_fin, 
            id_tipo, id_estado, id_asignacion, creado_por,
            peso, id_periodo, menciones // <--- AÑADIDO
        } = req.body;

        if (!titulo || !id_asignacion || !id_tipo) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // CHECK CONFLICTO AULA
        if (aula) {
            const hayConflicto = await model.checkAulaConflict(aula, fecha_inicio, fecha_fin);
            if (hayConflicto) {
                return res.status(409).json({ message: `El aula ${aula} está ocupada en ese horario.` });
            }
        }

        const nuevaActividad = await model.createActividadEvaluable({
            titulo, descripcion, aula, fecha_inicio, fecha_fin, 
            id_tipo, id_estado, id_asignacion, creado_por, 
            peso: peso || 0, id_periodo: id_periodo || null,
            menciones // <--- PASAR AL MODELO
        });

        res.json({ id: nuevaActividad.id_actividad, titulo, message: 'Actividad creada' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno', error });
    }
};

exports.getActividades = async (req, res) => {
    try {
        const rows = await model.getAllActividadesEvaluables();
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error obteniendo actividades', error });
    }
};

exports.getAulasDisponibles = async (req, res) => {
    try {
        const { fecha, inicio, fin } = req.query;
        if (!fecha || !inicio || !fin) {
            return res.status(400).json({ message: 'Faltan parámetros: fecha, inicio, fin' });
        }
        const aulas = await model.getAvailableAulas(fecha, inicio, fin);
        res.json(aulas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error buscando aulas', error });
    }
};

// FUNCIÓN PARA BORRAR 
exports.deleteActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await model.deleteActividadEvaluable(id);

        if (!success) {
            return res.status(404).json({ message: 'Actividad no encontrada' });
        }

        res.sendStatus(204); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar', error });
    }
};

// FUNCIÓN PARA ACTUALIZAR (PUT)
exports.updateActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            titulo, descripcion, aula, fecha_inicio, fecha_fin, 
            id_tipo, id_estado, id_asignacion, peso, id_periodo, menciones // <--- AÑADIDO
        } = req.body;

        // CHECK CONFLICTO AULA (Excluyendo la propia actividad)
        if (aula) {
            const hayConflicto = await model.checkAulaConflict(aula, fecha_inicio, fecha_fin, id);
            if (hayConflicto) {
                return res.status(409).json({ message: `El aula ${aula} está ocupada en ese horario.` });
            }
        }

        const actualizado = await model.updateActividadEvaluable(id, {
            titulo, descripcion, aula, fecha_inicio, fecha_fin, 
            id_tipo, id_estado, id_asignacion, peso: peso || 0, 
            id_periodo: id_periodo || null,
            menciones // <--- PASAR AL MODELO
        });

        if (!actualizado) {
            return res.status(404).json({ message: 'Actividad no encontrada' });
        }

        res.json({ message: 'Actividad actualizada correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar', error });
    }
};