import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importamos tus componentes principales
import { CalendarioComponent } from './calendario/calendario.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { CalendarioSemanalComponent } from './calendario-semanal/calendario-semanal.component';

const routes: Routes = [
  // 1. REDIRECCIÓN AUTOMÁTICA:
  // Al entrar a la web vacía (localhost:4200), te manda directo al calendario/dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Ruta del Dashboard (Calendario Mensual)
  { path: 'dashboard', component: CalendarioComponent },

  // Ruta para crear tareas (donde te lleva el botón nuevo)
  { path: 'crear-tarea', component: CrearTareaComponent },

  // Ruta para calendario semanal (si la usas)
  { path: 'semanal', component: CalendarioSemanalComponent },

  // Cualquier ruta desconocida te devuelve al dashboard
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }