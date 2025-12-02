import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {

  // Controla qué pantalla se ve: 
  // 'seleccion' (botones grandes), 'login', 'registro', 'recuperar1', 'recuperar2'
  vistaActual: string = 'seleccion';

  constructor() { }

  // Función para navegar entre las vistas
  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }

  // Simulación de entrar
  entrar() {
    console.log('Intentando entrar/registrar...');
    // Aquí tu compañero conectará con el Backend o redirigirá al Calendario
  }

}