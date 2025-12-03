 Arquitectura del Proyecto: Dashboard Docente

Este documento detalla la estructura técnica del proyecto, explicando la función de los archivos clave y cómo se comunican el Frontend, el Backend y la Base de Datos.

 1. Backend y Base de Datos

 Conexión Backend - Base de Datos

Archivo: src/db/pool.js

Función: (Archivo conector Backend ↔ Base de Datos).

Utiliza la librería mysql2 para crear un Pool de Conexiones con la base de datos MySQL (dashboard_docente).

Importancia: Sin este archivo, el servidor no tiene acceso a los datos. Se utiliza un "Pool" en lugar de una conexión simple para mantener conexiones abiertas y reutilizables, mejorando drásticamente la eficiencia.

 El Servidor

Archivo: Dashboard_Backend/index.js

Función: Punto de entrada de la aplicación.

Levanta el servidor en el puerto 3000.

Habilita CORS (imprescindible para permitir peticiones desde Angular).

Carga y activa las rutas de la API.

Lógica de Negocio (Controladores)

Archivo: src/controllers/actividadesEvaluables.controller.js

Función: Contiene las funciones que ejecutan las sentencias SQL reales:

createActividad: Ejecuta INSERT INTO...

getActividades: Ejecuta SELECT * FROM...

deleteActividad: Ejecuta DELETE FROM...

 Rutas (Enrutador)

Archivo: src/routes/actividadesEvaluables.routes.js

Función: Gestiona el tráfico de la API.

Asocia la petición GET / con la función getActividades.

Asocia la petición POST / con la función createActividad.

 2. Frontend (Angular)

 Conexión Frontend - Backend (El Puente)

Archivo: src/app/services/calendar.service.ts

Función: (Archivo conector Frontend ↔ Backend).

Define la dirección del servidor: http://localhost:3000/api.

Utiliza el módulo HttpClient de Angular para enviar las peticiones (GET, POST, DELETE) hacia el servidor Node.js.

 Navegación (Routing)

Archivo: src/app/app-routing.module.ts

Función: Convierte la web en una SPA (Single Page Application).

Gestiona la navegación virtual sin recargar la página completa.

Redirige automáticamente la ruta vacía '' hacia /dashboard (Calendario) y habilita la ruta /crear-tarea.

 Vista Principal (Calendario)

Archivo: src/app/calendario/calendario.component.ts

Función: Lógica visual del calendario.

ngOnInit: Llama al servicio para traer los datos reales.

Calcula los días del mes para pintar la cuadrícula.

Gestiona la función borrarTarea capturando el ID del evento.

 Formulario de Creación

Archivo: src/app/crear-tarea/crear-tarea.component.ts

Función: Gestión de nuevas tareas.

Dinámico: Carga los desplegables de "Módulos" y "Tipos" directamente desde la BD 

Empaqueta los datos en un JSON y los envía al servicio.

 Preguntas Clave de Arquitectura

¿Qué archivo une Node.js (Backend) y MySQL (Base de Datos)?

El archivo src/db/pool.js. Es el responsable de abrir el canal de comunicación usando las credenciales y la librería mysql2.

¿Qué archivo une Angular (Frontend) y Node.js (Backend)?

La comunicación es vía HTTP:

En el Frontend, el responsable es calendar.service.ts (lanza la petición a localhost:3000).

En el Backend, la petición entra por index.js (que la permite gracias a CORS) y es dirigida por el sistema de rutas hacia el controlador.
