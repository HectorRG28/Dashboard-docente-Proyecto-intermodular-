import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importamos tus componentes principales
import { CalendarioComponent } from './calendario/calendario.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { CalendarioSemanalComponent } from './calendario-semanal/calendario-semanal.component';

// YA NO NECESITAS IMPORTAR INICIO-SESION

const routes: Routes = [
  // 1. CAMBIO IMPORTANTE:
  // Al entrar a la web vacía, redirigimos automáticamente al dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Ruta del Dashboard (Esta será tu nueva "Home")
  { path: 'dashboard', component: CalendarioComponent },

  { path: 'crear-tarea', component: CrearTareaComponent },
  { path: 'semanal', component: CalendarioSemanalComponent },

  // Cualquier error redirige al dashboard
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }