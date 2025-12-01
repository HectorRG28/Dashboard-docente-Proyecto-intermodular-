// src/server.js
// ----------------------------------------------------------
// Punto de entrada del servidor HTTP.
// Configura Express, los middlewares globales, define
// rutas básicas y monta las rutas de recursos.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;                         // Paquete 'express'
let cors;                            // Paquete 'cors'
let app;                             // Aplicación de Express

let DEFAULT_PORT;                    // Puerto por defecto
let ENV_PORT;                        // Puerto definido en variables de entorno
let PORT;                            // Puerto final del servidor

let jsonMiddleware;                  // Middleware para parsear JSON
let corsMiddleware;                  // Middleware para permitir CORS

let rootHandler;                     // Handler GET '/'
let pingHandler;                     // Handler GET '/ping'
let startServer;                     // Función que inicia el servidor

// Routers de cada recurso
let usuariosRouter;                  // Router para /usuarios
let cursosRouter;                    // Router para /cursos
let gruposRouter;                    // Router para /grupos
let periodosRouter;                  // Router para /periodos
let modulosRouter;                   // Router para /modulos
let tiposActividadRouter;            // Router para /tipos-actividad
let estadosActividadRouter;          // Router para /estados-actividad
let asignacionesDocentesRouter;      // Router para /asignaciones-docentes
let actividadesEvaluablesRouter;     // Router para /actividades-evaluables
let matriculasRouter;                // Router para /matriculas
let calificacionesRouter;            // Router para /calificaciones


// 2. ASIGNACIONES
express = require('express');
cors = require('cors');

app = express();

DEFAULT_PORT = 3000;
ENV_PORT = process.env.PORT;
PORT = ENV_PORT || DEFAULT_PORT;

jsonMiddleware = express.json();
corsMiddleware = cors();

// Importación de routers
usuariosRouter              = require('./routes/usuarios.routes');
cursosRouter                = require('./routes/cursos.routes');
gruposRouter                = require('./routes/grupos.routes');
periodosRouter              = require('./routes/periodos.routes');
modulosRouter               = require('./routes/modulos.routes');
tiposActividadRouter        = require('./routes/tiposActividad.routes');
estadosActividadRouter      = require('./routes/estadosActividad.routes');
asignacionesDocentesRouter  = require('./routes/asignacionesDocentes.routes');
actividadesEvaluablesRouter = require('./routes/actividadesEvaluables.routes');
matriculasRouter            = require('./routes/matriculas.routes');
calificacionesRouter        = require('./routes/calificaciones.routes');


// 3. REGISTRO DE MIDDLEWARES
app.use(jsonMiddleware);
app.use(corsMiddleware);


// 4. HANDLERS BÁSICOS
rootHandler = function (req, res) {
  res.json({
    ok: true,
    mensaje: 'Backend dashboard_docente funcionando correctamente 🚀',
    version: '1.0.0'
  });
};

pingHandler = function (req, res) {
  res.json({
    ok: true,
    mensaje: 'pong'
  });
};


// 5. REGISTRO DE RUTAS DE LA API
app.get('/', rootHandler);
app.get('/ping', pingHandler);

app.use('/usuarios', usuariosRouter);
app.use('/cursos', cursosRouter);
app.use('/grupos', gruposRouter);
app.use('/periodos', periodosRouter);
app.use('/modulos', modulosRouter);
app.use('/tipos-actividad', tiposActividadRouter);
app.use('/estados-actividad', estadosActividadRouter);
app.use('/asignaciones-docentes', asignacionesDocentesRouter);
app.use('/actividades-evaluables', actividadesEvaluablesRouter);
app.use('/matriculas', matriculasRouter);
app.use('/calificaciones', calificacionesRouter);


// 6. FUNCIÓN PARA ARRANCAR EL SERVIDOR
startServer = function () {
  app.listen(PORT, function () {
    console.log('Servidor HTTP escuchando en el puerto ' + PORT);
  });
};


// 7. EJECUCIÓN
startServer();












