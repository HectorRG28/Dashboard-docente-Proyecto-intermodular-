const xlsx = require('xlsx');
const axios = require('axios');
const cheerio = require('cheerio');
const pool = require('../db/pool');
const fs = require('fs');

// UTILS
const parseDate = (dateStr) => {
    // Intenta parsear fechas "DD/MM/YYYY" o "YYYY-MM-DD"
    if (!dateStr) return new Date();
    // Si viene de Excel como número serial? (xlsx lo maneja si usamos cellDates: true, pero aquí lo leemos raw)
    const d = new Date(dateStr);
    if (!isNaN(d)) return d;
    return new Date();
};

exports.importFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Columnas esperadas: Titulo, Fecha (YYYY-MM-DD), HoraInicio (HH:MM), HoraFin (HH:MM), Aula, Descripcion
        let insertados = 0;

        for (const row of data) {
            const titulo = row['Titulo'] || row['Asignatura'] || 'Clase Importada';
            const fechaVal = row['Fecha'];
            const horaInicio = row['HoraInicio'] || '09:00';
            const horaFin = row['HoraFin'] || '10:00';
            const aula = row['Aula'] || '';
            const descripcion = row['Descripcion'] || 'Importado desde archivo';

            // Construir fechas SQL
            // Asumimos formato YYYY-MM-DD o Excel serial
            let fechaStr = fechaVal;
            if (typeof fechaVal === 'number') {
                // Convertir fecha excel
                const dateObj = new Date(Math.round((fechaVal - 25569) * 86400 * 1000));
                fechaStr = dateObj.toISOString().split('T')[0];
            }

            const fechaInicioSQL = `${fechaStr} ${horaInicio}:00`;
            const fechaFinSQL = `${fechaStr} ${horaFin}:00`;

            await pool.query(
                `INSERT INTO actividad_evaluable 
                (titulo, descripcion, aula, fecha_inicio, fecha_fin, id_tipo, id_estado, id_asignacion, creado_por) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [titulo, descripcion, aula, fechaInicioSQL, fechaFinSQL, 1, 1, 1, 1] // id_tipo=1 (Examen/Tarea?), id_asignacion=1 (Default), user=1
            );
            insertados++;
        }

        // Limpiar archivo
        fs.unlinkSync(filePath);

        res.json({ message: `Se importaron ${insertados} clases correctamente.` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando archivo', error: error.message });
    }
};

exports.importWeb = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ message: 'URL requerida' });

        // Intento básico de scraping de tablas
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let count = 0;

        // Buscar tablas
        $('table tr').each(async (i, el) => {
            // Lógica MUY básica: asumimos que las celdas tienen datos
            // Esto es frágil y depende de la estructura exacta de EduPage, que es compleja.
            // Para este ejemplo, solo contamos filas encontradas como "simulación" si no podemos parsear exacto.
            // EduPage suele usar divs con clases específicas, no tablas simples.
            // Si el cliente quiere EduPage real, necesitaría Puppeteer.
            // Aquí haremos un "best effort" buscando textos que parezcan horas.
            
            // Placeholder: Si detectamos formato EduPage, avisamos
            if (html.includes('edupage')) {
                // EduPage carga por JS.
                throw new Error('EduPage requiere navegador completo (Puppeteer) para importar. Use la opción de CSV exportado de EduPage.');
            }
        });
        
        // Si no es EduPage y encontramos algo:
        // (Omitimos implementación compleja genérica)

        res.json({ message: 'Conexión exitosa, pero no se pudieron extraer datos automáticamente de esta URL (requiere autenticación o JS). Por favor usa la importación por Archivo.' });

    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Error importando web: ' + error.message });
    }
};
