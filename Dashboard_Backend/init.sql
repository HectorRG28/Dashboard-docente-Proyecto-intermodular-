-- Script de creación de base de datos "dashboard_docente"
-- Generado automáticamente en base al código del backend

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Base de datos
-- ----------------------------
CREATE DATABASE IF NOT EXISTS `dashboard_docente` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `dashboard_docente`;

-- ----------------------------
-- 1. Tabla: usuario
-- ----------------------------
DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) DEFAULT NULL, -- Se infiere que podría haber password aunque no se vio en modelos explícitos, se deja null por si acaso gestión externa o futura
  `rol` enum('admin','docente','alumno') NOT NULL DEFAULT 'alumno',
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `token_recuperacion` varchar(255) DEFAULT NULL,
  `token_expiracion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 2. Tabla: curso_academico
-- ----------------------------
DROP TABLE IF EXISTS `curso_academico`;
CREATE TABLE `curso_academico` (
  `id_curso` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_curso` varchar(100) NOT NULL, -- Ej: "2023-2024"
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_curso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 3. Tabla: grupo
-- ----------------------------
DROP TABLE IF EXISTS `grupo`;
CREATE TABLE `grupo` (
  `id_grupo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_grupo` varchar(100) NOT NULL, -- Ej: "1º DAW", "2º DAW"
  PRIMARY KEY (`id_grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 4. Tabla: modulo
-- ----------------------------
DROP TABLE IF EXISTS `modulo`;
CREATE TABLE `modulo` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_modulo` varchar(150) NOT NULL,
  `codigo_modulo` varchar(20) DEFAULT NULL, -- Ej: "DWEC", "DIW"
  PRIMARY KEY (`id_modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 5. Tabla: asignatura (Parece ser un alias o tabla extra mencionada en los JOINs de activ. evaluables)
-- Revisando modelos: JOIN asignatura asi ON ad.id_asignatura = asi.id_asignatura
-- En asignacion_docente se usa id_modulo, pero en actividad_evaluable se hace JOIN con asignatura.
-- Voy a asimilar que Modulo y Asignatura son conceptualmente lo mismo o tablas relacionadas.
-- Basado en el código: JOIN asignatura asi ON ad.id_asignatura = asi.id_asignatura
-- Y asignacion_docente tiene id_modulo. 
-- CORRECCIÓN: En asignacionesDocentes.model.js se usa `id_modulo` y `JOIN modulo`.
-- PERO en actividadesEvaluables.model.js línea 23: `JOIN asignatura asi ON ad.id_asignatura = asi.id_asignatura`
-- Esto sugiere una inconsistencia en el código o que `asignacion_docente` tiene ambos campos o que `modulo` es la tabla `asignatura`.
-- Voy a crear AMBAS para asegurar compatibilidad, o unificar. 
-- Dado que asignacionesDocentes es el "master" de asignaciones, usaremos `modulo` como principal y `asignatura` como espejo si es necesario,
-- o asumiremos que el código de actividadesEvaluables se refería a modulos.
-- Sin embargo, para que el SQL no falle con el código ACTUAL de actividadesEvaluables, necesito la tabla `asignatura`.
-- Y asignacion_docente DEBE tener `id_asignatura`.
-- Miremos asignacionesDocentes.model.js otra vez... usa `id_modulo`.
-- Miremos actividadesEvaluables.model.js... usa `ad.id_asignatura`.
-- CONCLUSIÓN: El código backend tiene una inconsistencia de nombres. 
-- SOLUCIÓN: Crear `asignatura` y que `asignacion_docente` tenga `id_asignatura` (quizás apuntando a modulo o siendo otra cosa).
-- Para simplificar y arreglar, crearé `asignatura` igual que `modulo` y añadiré la columna a `asignacion_docente`.

DROP TABLE IF EXISTS `asignatura`;
CREATE TABLE `asignatura` (
  `id_asignatura` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `color` varchar(20) DEFAULT '#3498db',
  PRIMARY KEY (`id_asignatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- ----------------------------
-- 6. Tabla: tipo_actividad
-- ----------------------------
DROP TABLE IF EXISTS `tipo_actividad`;
CREATE TABLE `tipo_actividad` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(50) NOT NULL, -- "Examen", "Tarea", "Proyecto"
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 7. Tabla: estado_actividad
-- ----------------------------
DROP TABLE IF EXISTS `estado_actividad`;
CREATE TABLE `estado_actividad` (
  `id_estado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(50) NOT NULL, -- "Pendiente", "Entregado", "Calificado"
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 8. Tabla: periodo_evaluacion
-- ----------------------------
DROP TABLE IF EXISTS `periodo_evaluacion`;
CREATE TABLE `periodo_evaluacion` (
  `id_periodo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_periodo` varchar(50) NOT NULL, -- "1ª Evaluación", "2ª Evaluación"
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  PRIMARY KEY (`id_periodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 9. Tabla: asignacion_docente
-- ----------------------------
DROP TABLE IF EXISTS `asignacion_docente`;
CREATE TABLE `asignacion_docente` (
  `id_asignacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_docente` int(11) NOT NULL,
  `id_modulo` int(11) DEFAULT NULL,      -- Usado en asignacionesDocentes.model.js
  `id_asignatura` int(11) DEFAULT NULL,  -- Usado en actividadesEvaluables.model.js (posible duplicidad en código, agregamos para soporte)
  `id_grupo` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `horas_asignadas` int(11) DEFAULT 0,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_asignacion`),
  KEY `fk_ad_docente` (`id_docente`),
  KEY `fk_ad_modulo` (`id_modulo`),
  KEY `fk_ad_asignatura` (`id_asignatura`),
  KEY `fk_ad_grupo` (`id_grupo`),
  KEY `fk_ad_curso` (`id_curso`),
  CONSTRAINT `fk_ad_curso` FOREIGN KEY (`id_curso`) REFERENCES `curso_academico` (`id_curso`) ON DELETE CASCADE,
  CONSTRAINT `fk_ad_docente` FOREIGN KEY (`id_docente`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `fk_ad_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON DELETE CASCADE,
  CONSTRAINT `fk_ad_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`) ON DELETE SET NULL,
  CONSTRAINT `fk_ad_asignatura` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 10. Tabla: actividad_evaluable
-- ----------------------------
DROP TABLE IF EXISTS `actividad_evaluable`;
CREATE TABLE `actividad_evaluable` (
  `id_actividad` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `aula` varchar(50) DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `id_tipo` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL DEFAULT 1,
  `id_asignacion` int(11) NOT NULL,
  `creado_por` int(11) NOT NULL,
  `peso` decimal(5,2) DEFAULT 0.00,
  `id_periodo` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_actividad`),
  KEY `fk_ae_tipo` (`id_tipo`),
  KEY `fk_ae_estado` (`id_estado`),
  KEY `fk_ae_asignacion` (`id_asignacion`),
  KEY `fk_ae_creador` (`creado_por`),
  KEY `fk_ae_periodo` (`id_periodo`),
  CONSTRAINT `fk_ae_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `asignacion_docente` (`id_asignacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_ae_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `fk_ae_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado_actividad` (`id_estado`),
  CONSTRAINT `fk_ae_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodo_evaluacion` (`id_periodo`) ON DELETE SET NULL,
  CONSTRAINT `fk_ae_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_actividad` (`id_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 11. Tabla: matricula
-- ----------------------------
DROP TABLE IF EXISTS `matricula`;
CREATE TABLE `matricula` (
  `id_matricula` int(11) NOT NULL AUTO_INCREMENT,
  `id_alumno` int(11) NOT NULL,
  `id_grupo` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `fecha_matricula` date DEFAULT curdate(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_matricula`),
  KEY `fk_mat_alumno` (`id_alumno`),
  KEY `fk_mat_grupo` (`id_grupo`),
  KEY `fk_mat_curso` (`id_curso`),
  CONSTRAINT `fk_mat_alumno` FOREIGN KEY (`id_alumno`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `fk_mat_curso` FOREIGN KEY (`id_curso`) REFERENCES `curso_academico` (`id_curso`) ON DELETE CASCADE,
  CONSTRAINT `fk_mat_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 12. Tabla: calificacion
-- ----------------------------
DROP TABLE IF EXISTS `calificacion`;
CREATE TABLE `calificacion` (
  `id_calificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_actividad` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `nota` decimal(4,2) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_calificacion` datetime DEFAULT current_timestamp(),
  `revisado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_calificacion`),
  KEY `fk_cal_actividad` (`id_actividad`),
  KEY `fk_cal_alumno` (`id_alumno`),
  CONSTRAINT `fk_cal_actividad` FOREIGN KEY (`id_actividad`) REFERENCES `actividad_evaluable` (`id_actividad`) ON DELETE CASCADE,
  CONSTRAINT `fk_cal_alumno` FOREIGN KEY (`id_alumno`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 13. Tabla: aulas (Configuración)
-- ----------------------------
DROP TABLE IF EXISTS `aulas`;
CREATE TABLE `aulas` (
  `id_aula` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_aula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- 14. Tabla: actividad_mencion
-- ----------------------------
DROP TABLE IF EXISTS `actividad_mencion`;
CREATE TABLE `actividad_mencion` (
  `id_mencion` int(11) NOT NULL AUTO_INCREMENT,
  `id_actividad` int(11) NOT NULL,
  `id_docente` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_mencion`),
  KEY `fk_am_actividad` (`id_actividad`),
  KEY `fk_am_docente` (`id_docente`),
  CONSTRAINT `fk_am_actividad` FOREIGN KEY (`id_actividad`) REFERENCES `actividad_evaluable` (`id_actividad`) ON DELETE CASCADE,
  CONSTRAINT `fk_am_docente` FOREIGN KEY (`id_docente`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- DATOS DE EJEMPLO E INICIALES
-- ----------------------------

-- Usuarios (Docentes y Alumnos)
INSERT INTO `usuario` (id_usuario, nombre, apellidos, email, rol, estado) VALUES
(1, 'Admin', 'Sistema', 'admin@dashboard.com', 'admin', 'activo'),
(2, 'Juan', 'Pérez Docente', 'juan.perez@colegio.com', 'docente', 'activo'),
(3, 'María', 'García Alumna', 'maria.garcia@colegio.com', 'alumno', 'activo');

-- Curso Académico
INSERT INTO `curso_academico` (nombre_curso, fecha_inicio, fecha_fin) VALUES
('2025-2026', '2025-09-01', '2026-06-30');

-- Grupos
INSERT INTO `grupo` (nombre_grupo) VALUES ('1º DAM'), ('2º DAM'), ('1º DAW');

-- Módulos
INSERT INTO `modulo` (nombre_modulo, codigo_modulo) VALUES 
('Programación', 'PROG'), 
('Entornos de Desarrollo', 'ED'),
('Desarrollo Web en Entorno Cliente', 'DWEC');

-- Asignaturas (Espejo de módulos para compatibilidad)
INSERT INTO `asignatura` (id_asignatura, nombre, color) VALUES
(1, 'Programación', '#e74c3c'),
(2, 'Entornos de Desarrollo', '#8e44ad'),
(3, 'Desarrollo Web Cliente', '#2ecc71');

-- Tipos de Actividad
INSERT INTO `tipo_actividad` (nombre_tipo) VALUES ('Examen'), ('Práctica'), ('Proyecto'), ('Tarea');

-- Estados de Actividad
INSERT INTO `estado_actividad` (nombre_estado) VALUES ('Pendiente'), ('Publicada'), ('Finalizada');

-- Periodos
INSERT INTO `periodo_evaluacion` (nombre_periodo, fecha_inicio, fecha_fin) VALUES
('1ª Evaluación', '2025-09-01', '2025-12-22'),
('2ª Evaluación', '2026-01-08', '2026-03-22');

-- Asignación Docente (Juan Pérez da Programación en 1º DAM)
-- Nota: Rellenamos tanto id_modulo como id_asignatura para evitar errores
INSERT INTO `asignacion_docente` (id_docente, id_modulo, id_asignatura, id_grupo, id_curso, horas_asignadas) 
VALUES (2, 1, 1, 1, 1, 200);

SET FOREIGN_KEY_CHECKS = 1;
