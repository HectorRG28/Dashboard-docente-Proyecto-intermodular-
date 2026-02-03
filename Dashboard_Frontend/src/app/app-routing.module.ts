import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarioComponent } from './features/calendar/monthly/calendario.component';
import { CrearTareaComponent } from './features/calendar/task-form/crear-tarea.component';
import { CalendarioSemanalComponent } from './features/calendar/weekly/calendario-semanal.component';
import { AjustesComponent } from './features/settings/preferences/ajustes.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  
  // Rutas protegidas
  { path: 'dashboard', component: CalendarioSemanalComponent, canActivate: [AuthGuard] },
  { path: 'horario', redirectTo: '/dashboard' }, // Alias antiguo
  { path: 'calendario-mensual', component: CalendarioComponent, canActivate: [AuthGuard] },
  { path: 'crear-tarea', component: CrearTareaComponent, canActivate: [AuthGuard] },
  { path: 'ajustes', component: AjustesComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }