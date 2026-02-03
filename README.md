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

- **📅 Calendario Avanzado**: Vistas mensual y semanal sincronizadas.
- **📝 Gestión de Tareas**: CRUD completo de actividades evaluables.
- **� Detección de Conflictos**: Algoritmo inteligente que impide reservar la misma aula dos veces.
- **� Sistema de Menciones**: Etiqueta a otros docentes en las tareas.
- **🌗 Modo Oscuro**: Interfaz adaptativa con persistencia de usuario.
- **📂 Importación Inteligente**: Carga masiva desde Excel y scraping web.
- **🔐 Seguridad JWT**: Autenticación robusta y protección de rutas.

---

## 📂 Estructura del Proyecto (Arquitectura Modular)

El proyecto sigue una arquitectura profesional escalable:

```
/
├── Dashboard_Backend/      # API REST (MVC Pattern)
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio (Validaciones, Algoritmos)
│   │   ├── routes/         # Endpoints (Usuarios, Cursos, Aulas...)
│   │   ├── models/         # Consultas SQL optimizadas
│   │   └── server.js       # Entry point con fallback SPA
│
├── Dashboard_Frontend/     # SPA Angular (Feature-Based Architecture)
   ├── src/app/
   │   ├── core/           # Servicios Singleton (Auth, Modal, Theme)
   │   ├── features/       # Módulos Funcionales
   │   │   ├── auth/       # Login, Registro, Recuperación
   │   │   ├── calendar/   # Vistas Mensual/Semanal y Formularios
   │   │   └── settings/   # Preferencias de usuario
   │   └── shared/         # Componentes reutilizables
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir lo que te gustaría cambiar.

---
