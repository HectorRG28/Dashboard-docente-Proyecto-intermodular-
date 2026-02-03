import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; // Necesario para los formularios
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { CalendarioSemanalComponent } from './calendario-semanal/calendario-semanal.component';
import { AjustesComponent } from './ajustes/ajustes.component'; 
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { GlobalErrorHandler } from './core/handlers/global-error-handler';
import { ModalService } from './core/services/modal.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    CrearTareaComponent,
    CalendarioSemanalComponent,
    AjustesComponent,
    ErrorModalComponent
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