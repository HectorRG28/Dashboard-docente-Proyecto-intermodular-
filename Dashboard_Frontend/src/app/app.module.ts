import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// 1. IMPORTAR ESTO:
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; // Necesario para los formularios

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// ... tus otros componentes ...
import { CalendarioComponent } from './calendario/calendario.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { CalendarioSemanalComponent } from './calendario-semanal/calendario-semanal.component';
import { AjustesComponent } from './ajustes/ajustes.component'; // Si tienes el de ajustes

@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    CrearTareaComponent,
    CalendarioSemanalComponent,
    AjustesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // 2. AÑADIRLO AQUÍ:
    HttpClientModule, 
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }