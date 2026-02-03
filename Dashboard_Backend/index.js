const express = require('express');
const cors = require('cors');

// --- CORRECCIÓN DE RUTAS: AÑADIMOS './src/' ---
// Como index.js está fuera, tenemos que decirle que entre en 'src'
const actividadesRoutes = require('./src/routes/actividadesEvaluables.routes.js');
const tiposRoutes = require('./src/routes/tiposActividad.routes.js');
const modulosRoutes = require('./src/routes/modulos.routes.js');

// También corregimos la ruta de la configuración
const { PORT } = require('./src/db/config.js');

const app = express();

app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/api/actividades-evaluables', actividadesRoutes);
app.use('/api/tipos-actividad', tiposRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/import', require('./src/routes/import.routes.js'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});