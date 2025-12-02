import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { AjustesComponent } from './ajustes/ajustes.component';
import { CalendarioSemanalComponent } from './calendario-semanal/calendario-semanal.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    CrearTareaComponent,
    AjustesComponent,
    CalendarioSemanalComponent,
    InicioSesionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
