// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// 1. ASEGÚRATE DE QUE ESTO ESTÁ IMPORTADO AQUÍ ARRIBA
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';

// Tus componentes (Angular ya los habrá puesto aquí solos)

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
    // 2. ¡IMPORTANTE! TIENE QUE ESTAR EN ESTA LISTA:
    AppRoutingModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }