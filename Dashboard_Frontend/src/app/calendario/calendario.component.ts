import { Component } from '@angular/core';

@Component({
  selector: 'app-calendario', // Asegúrate de usar este nombre al llamarlo
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {

  // Variable para mostrar/ocultar el popup de ajustes
  mostrarAjustes: boolean = false;

  // Datos para generar el HTML
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Array falso de 35 elementos para rellenar la cuadrícula (5 filas x 7 cols)
  celdasCalendario: any[] = new Array(35); 

  constructor() { }

  // Función para abrir/cerrar ajustes
  toggleAjustes() {
    this.mostrarAjustes = !this.mostrarAjustes;
  }
}