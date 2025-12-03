// src/models/tiposActividad.model.js
const pool = require('../db/pool');

// OBTENER TODOS LOS TIPOS (De la tabla 'tipo_evaluacion')
const getAllTiposActividad = async function () {
  try {
    const sql = 'SELECT * FROM tipo_evaluacion';
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

// OBTENER UN TIPO POR ID
const getTipoActividadById = async function (id) {
  try {
    const sql = 'SELECT * FROM tipo_evaluacion WHERE id_tipo = ?';
    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllTiposActividad,
  getTipoActividadById
};