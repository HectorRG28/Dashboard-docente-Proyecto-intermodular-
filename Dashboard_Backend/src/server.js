// src/server.js
// ----------------------------------------------------------
// Servidor PRINCIPAL corregido
// ----------------------------------------------------------

const express = require('express');
const cors = require('cors');

const app = express();

const DEFAULT_PORT = 3000;
// Si tienes un archivo .env, lo cogerá, si no usa el 3000
const PORT = process.env.PORT || DEFAULT_PORT; 

app.use(express.json());
app.use(cors());

// --- 1. IMPORTACIÓN DE ROUTERS ---
const usuariosRouter              = require('./routes/usuarios.routes');
const cursosRouter                = require('./routes/cursos.routes');
const gruposRouter                = require('./routes/grupos.routes');
const periodosRouter              = require('./routes/periodos.routes');
const modulosRouter               = require('./routes/modulos.routes');
const tiposActividadRouter        = require('./routes/tiposActividad.routes');
const estadosActividadRouter      = require('./routes/estadosActividad.routes');
const asignacionesDocentesRouter  = require('./routes/asignacionesDocentes.routes');
const actividadesEvaluablesRouter = require('./routes/actividadesEvaluables.routes');
const matriculasRouter            = require('./routes/matriculas.routes');
const calificacionesRouter        = require('./routes/calificaciones.routes');
const authRouter                  = require('./routes/auth.routes');

// OJO: Si tienes un archivo de rutas para aulas, impórtalo aquí. 
// Si no lo tienes creado aún, comenta esta línea o dará error.
// const aulasRouter = require('./routes/aulas.routes'); 

// --- 2. REGISTRO DE RUTAS CON EL PREFIJO '/api' ---
// Esto es lo que faltaba para que Angular las encuentre
app.use('/api/usuarios', usuariosRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/grupos', gruposRouter);
app.use('/api/periodos', periodosRouter);
app.use('/api/modulos', modulosRouter);
app.use('/api/tipos-actividad', tiposActividadRouter);
app.use('/api/estados-actividad', estadosActividadRouter);
app.use('/api/asignaciones-docentes', asignacionesDocentesRouter);

// IMPORTANTE: Aquí corregimos el nombre para que coincida con lo que busca Angular
app.use('/api/actividades-evaluables', actividadesEvaluablesRouter); 
app.use('/api/actividades', actividadesEvaluablesRouter); // Pongo las dos por si acaso en Angular llamas a una u otra
app.use('/api/matriculas', matriculasRouter);
app.use('/api/calificaciones', calificacionesRouter);
app.use('/api/auth', authRouter);

// --- RUTA EXTRA PARA AULAS (Si no tienes archivo de rutas aun) ---
// Si no tienes 'src/routes/aulas.routes.js', descomenta esto para que el desplegable no falle:
/*
app.get('/api/aulas', (req, res) => {
    // Simulación de aulas si no hay tabla
    res.json([
        { id: 1, nombre: 'Aula 101' },
        { id: 2, nombre: 'Aula 102' },
        { id: 3, nombre: 'Informática 1' }
    ]);
});
*/
// Si YA tienes el archivo aulas.routes.js y la tabla en BD, usa:
// app.use('/api/aulas', aulasRouter);


const path = require('path');

// --- 3. SERVIR FRONTEND (PRODUCCIÓN) O REDIRIGIR (DESARROLLO) ---
const frontendDistPath = path.join(__dirname, '../../Dashboard_Frontend/dist/dashboard-docente-pi');

// 1. Servir ficheros estáticos si existen (Build de producción)
app.use(express.static(frontendDistPath));

// 2. Cualquier otra ruta -> Servir index.html (SPA) O Redirigir a Angular CLI (4200)
app.get('*', (req, res) => {
    // Si la petición pide un archivo (tiene extensión), pasamos (404 normal de API)
    if (req.url.includes('.')) return res.sendStatus(404);

    const indexHtml = path.join(frontendDistPath, 'index.html');
    const fs = require('fs');

    if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
    } else {
        // Modo Desarrollo: Si no hay build, redirigir al puerto de Angular
        console.log(`⚠️ Redirigiendo ${req.url} al Frontend (4200)...`);
        res.redirect(`http://localhost:4200${req.url}`);
    }
});

// --- 4. ARRANQUE ---
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}/api/`);
});