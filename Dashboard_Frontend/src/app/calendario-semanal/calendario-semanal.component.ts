import { Component } from '@angular/core';

@Component({
  selector: 'app-calendario-semanal',
  templateUrl: './calendario-semanal.component.html',
  styleUrls: ['./calendario-semanal.component.scss']
})
export class CalendarioSemanalComponent {

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Generamos lista de horas desde 00:00 hasta 23:00
  horas: string[] = [];

  constructor() {
    this.generarHoras();
  }

  generarHoras() {
    for (let i = 0; i < 24; i++) {
      const inicio = i;
      const fin = i + 1;
      // Formato "0:00-1:00"
      this.horas.push(`${inicio}:00-${fin}:00`);
    }
  }

  clickCelda(dia: string, hora: string) {
    console.log(`Click en ${dia} a las ${hora}`);
    // Aquí podrías navegar a la pantalla de "Crear Tarea" si quisieras
  }

}