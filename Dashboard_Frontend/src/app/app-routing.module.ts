import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importamos tus componentes principales
import { CalendarioComponent } from './calendario/calendario.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { CalendarioSemanalComponent } from './calendario-semanal/calendario-semanal.component';

const routes: Routes = [
  // 1. REDIRECCIÓN AUTOMÁTICA (CAMBIO CLAVE):
  // Antes iba a /dashboard. Ahora le decimos que vaya a /horario nada más entrar.
  { path: '', redirectTo: '/horario', pathMatch: 'full' },

  // 2. RUTA PRINCIPAL (TU NUEVO HORARIO):
  // He renombrado el path 'semanal' a 'horario' para que quede más profesional en la URL.
  // Aquí es donde cargaremos la vista de Lunes a Viernes.
  { path: 'horario', component: CalendarioSemanalComponent },

  // 3. RUTA SECUNDARIA (EL CALENDARIO ANTIGUO):
  // He cambiado 'dashboard' por 'calendario-mensual'.
  // Así cumples el requisito de tener una vista mensual separada.
  { path: 'calendario-mensual', component: CalendarioComponent },

  // Ruta para crear tareas (se mantiene igual)
  { path: 'crear-tarea', component: CrearTareaComponent },

  // Cualquier ruta desconocida te devuelve al horario principal
  { path: '**', redirectTo: '/horario' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }