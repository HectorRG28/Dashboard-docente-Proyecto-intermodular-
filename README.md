# 🎓 Dashboard Docente - Proyecto Intermodular

Este proyecto es una aplicación web completa diseñada para la gestión de actividades docentes. Permite a los profesores planificar, visualizar y gestionar actividades evaluables a través de una interfaz moderna basada en calendarios.

El sistema utiliza una arquitectura **Full Stack** separando claramente el Frontend y el Backend.

---

## 🚀 Tecnologías Utilizadas

### Frontend (Cliente)

- **Framework**: [Angular v16](https://angular.io/)
- **Lenguaje**: TypeScript
- **Estilos**: CSS3 moderno
- **Comunicación**: HTTP Client (API Rest)

### Backend (Servidor)

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Gestión de Base de Datos**: MySQL2
- **Utilidades**:
  - `xlsx` (Procesamiento de archivos Excel)
  - `multer` (Subida de archivos)
  - `cors` (Gestión de acceso entre dominios)

### Base de Datos

- **Motor**: MySQL
- **Nombre por defecto**: `dashboard_docente`

---

## ✨ Características Principales

- **📅 Vista de Calendario**: Visualización interactiva de las actividades evaluables del mes.
- **📝 Gestión de Tareas**: Crear, leer, actualizar y eliminar (CRUD) actividades evaluables.
- **📂 Importación de Datos**: Capacidad para importar datos masivos desde archivos Excel.
- **🏷️ Categorización**: Gestión de tipos de actividades y módulos asignados.
- **🔗 Arquitectura Desacoplada**: comunicación vía API RESTful entre Angular y Node.js.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (o XAMPP/WAMP/MAMP)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto:

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Dashboard-docente-Proyecto-intermodular--1
```

### 2. Configurar el Backend (Servidor)

```bash
cd Dashboard_Backend
npm install
```

**Configuración de Base de Datos:**
El sistema espera una base de datos MySQL llamada `dashboard_docente`.
El archivo de configuración se encuentra en `Dashboard_Backend/src/db/config.js`. Los valores por defecto son:

- **Host**: localhost
- **Usuario**: root
- **Contraseña**: (vacía)
- **Puerto**: 3306

Si tu configuración de MySQL es diferente, puedes ajustar este archivo o usar variables de entorno.

### 3. Configurar el Frontend (Angular)

```bash
cd ../Dashboard_Frontend
npm install
```

---

## ▶️ Ejecución del Proyecto

Necesitarás dos terminales abiertas para ejecutar el proyecto completo (una para el backend y otra para el frontend).

### Terminal 1: Iniciar Backend

```bash
cd Dashboard_Backend
npm start
```

_El servidor debería arrancar en `http://localhost:3000` y mostrar "✅ Base de datos conectada correctamente"._

### Terminal 2: Iniciar Frontend

```bash
cd Dashboard_Frontend
ng serve
```

_Una vez compilado, abre tu navegador en `http://localhost:4200`._

---

## 📂 Estructura del Proyecto

```
/
├── Dashboard_Backend/      # Servidor API Node.js/Express
│   ├── src/
│   │   ├── config/         # Configuraciones de DB
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Definición de endpoints API
│   │   ├── db/             # Conexión a Base de Datos
│   │   └── server.js       # Punto de entrada del servidor
│   └── package.json
│
├── Dashboard_Frontend/     # Aplicación Cliente Angular
│   ├── src/
│   │   ├── app/            # Componentes, Servicios y Modelos
│   │   └── assets/         # Imágenes y recursos estáticos
│   └── angular.json
│
└── README.md               # Documentación del proyecto
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir lo que te gustaría cambiar.

---

Generado automáticamente por Antigravity.
