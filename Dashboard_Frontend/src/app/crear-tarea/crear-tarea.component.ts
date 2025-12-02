import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.scss']
})
export class CrearTareaComponent {

  // Variable para controlar si se ve el popup
  mostrarPopup: boolean = false;

  constructor() { }

  // Función para abrir el popup (se llama al pulsar "duración")
  abrirPopup() {
    this.mostrarPopup = true;
  }

  // Función para cerrar el popup (se llama al pulsar "Aceptar")
  cerrarPopup() {
    this.mostrarPopup = false;
  }

}