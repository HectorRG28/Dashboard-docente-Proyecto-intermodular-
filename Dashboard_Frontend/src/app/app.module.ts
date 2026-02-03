import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; // Necesario para los formularios
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarioComponent } from './features/calendar/monthly/calendario.component';
import { CrearTareaComponent } from './features/calendar/task-form/crear-tarea.component';
import { CalendarioSemanalComponent } from './features/calendar/weekly/calendario-semanal.component';
import { AjustesComponent } from './features/settings/preferences/ajustes.component'; 
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { GlobalErrorHandler } from './core/handlers/global-error-handler';
import { ModalService } from './core/services/modal.service';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    CrearTareaComponent,
    CalendarioSemanalComponent,
    AjustesComponent,
    AjustesComponent,
    ErrorModalComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule
  ],
  providers: [
    ModalService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }