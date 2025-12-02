import { Component } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent {

  // --- VARIABLES ---
  isDarkMode: boolean = false;
  timeFormat: string = '12h';

  constructor() { }

  // --- FUNCIONES ---
  
  // Esta es la función que busca tu HTML para el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    console.log('Modo oscuro:', this.isDarkMode);
  }

  // Esta es la función para el formato de hora
  setFormat(format: string) {
    this.timeFormat = format;
    console.log('Formato hora:', this.timeFormat);
  }

}