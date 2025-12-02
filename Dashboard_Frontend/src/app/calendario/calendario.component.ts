import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  // Asegúrate de que esto coincide con tu archivo real (.css o .scss)
  styleUrls: ['./calendario.component.scss'] 
})
export class CalendarioComponent implements OnInit {

  // --- VARIABLES PARA EL HTML ---
  mostrarAjustes: boolean = false;
  
  // Variables de fechas
  fechaActual: Date = new Date(); 
  mesActualVisual: Date = new Date(); 
  
  // Nombres para mostrar en la cabecera
  nombresMeses: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Arrays de datos
  diasMiniCalendario: any[] = []; 
  celdasCalendario: any[] = new Array(35); // Huecos para el calendario grande

  constructor() { }

  ngOnInit(): void {
    this.generarMiniCalendario();
  }

  // --- LÓGICA DEL MINI CALENDARIO ---
  generarMiniCalendario() {
    this.diasMiniCalendario = [];
    const year = this.mesActualVisual.getFullYear();
    const month = this.mesActualVisual.getMonth();

    // Calcular en qué día cae el 1 del mes (ajustando Lunes=0)
    let primerDiaSemana = new Date(year, month, 1).getDay(); 
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; 

    const ultimoDiaMes = new Date(year, month + 1, 0).getDate();

    // Rellenar huecos vacíos
    for (let i = 0; i < primerDiaSemana; i++) {
      this.diasMiniCalendario.push({ numero: '', esHueco: true });
    }

    // Rellenar días reales
    for (let i = 1; i <= ultimoDiaMes; i++) {
      const esHoy = 
        i === this.fechaActual.getDate() &&
        month === this.fechaActual.getMonth() &&
        year === this.fechaActual.getFullYear();

      this.diasMiniCalendario.push({ 
        numero: i, 
        esHueco: false, 
        esHoy: esHoy 
      });
    }
  }

  cambiarMes(direccion: number) {
    this.mesActualVisual.setMonth(this.mesActualVisual.getMonth() + direccion);
    this.mesActualVisual = new Date(this.mesActualVisual); // Forzar actualización
    this.generarMiniCalendario();
  }

  seleccionarDia(dia: number) {
    console.log('Click en día:', dia);
  }

  toggleAjustes() {
    this.mostrarAjustes = !this.mostrarAjustes;
  }
}