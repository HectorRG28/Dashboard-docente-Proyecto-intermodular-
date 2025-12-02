import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// 1. IMPORTAR ESTO:
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; // Necesario para los formularios

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// ... tus otros componentes ...
import { CalendarioComponent } from './calendario/calendario.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    // ... otros componentes
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