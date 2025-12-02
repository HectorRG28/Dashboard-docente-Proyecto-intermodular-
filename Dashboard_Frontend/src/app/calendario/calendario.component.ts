import { Component, OnInit } from '@angular/core';
// Importamos el servicio que acabas de crear
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  mostrarAjustes: boolean = false;
  
  // Fechas y Visualización
  fechaActual: Date = new Date(); 
  mesActualVisual: Date = new Date(); 
  
  nombresMeses: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Datos
  diasMiniCalendario: any[] = []; 
  celdasCalendario: any[] = [];
  eventosDesdeBD: any[] = [];   // Aquí guardaremos los datos del backend

  // INYECTAMOS EL SERVICIO AQUÍ
  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.generarMiniCalendario();
    this.cargarEventos(); // Llamamos al backend al iniciar
  }

  // --- 1. CARGAR DATOS DEL BACKEND ---
  cargarEventos() {
    this.calendarService.getActividades().subscribe({
      next: (datos) => {
        console.log('✅ Eventos cargados:', datos);
        this.eventosDesdeBD = datos;
        this.generarCalendarioGrande(); // Regeneramos el calendario con los datos
      },
      error: (e) => console.error('❌ Error cargando eventos:', e)
    });
  }

  // --- 2. GENERAR CALENDARIO GRANDE ---
  generarCalendarioGrande() {
    this.celdasCalendario = [];
    const year = this.mesActualVisual.getFullYear();
    const month = this.mesActualVisual.getMonth();

    // Calcular primer día (Lunes=0)
    let primerDiaSemana = new Date(year, month, 1).getDay(); 
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; 

    const ultimoDiaMes = new Date(year, month + 1, 0).getDate();

    // Rellenar huecos vacíos iniciales
    for (let i = 0; i < primerDiaSemana; i++) {
      this.celdasCalendario.push({ numero: '', esHueco: true, eventos: [] });
    }

    // Rellenar días reales
    for (let i = 1; i <= ultimoDiaMes; i++) {
      const fechaDeEstaCelda = new Date(year, month, i);
      
      // FILTRAR: ¿Hay eventos para hoy?
      const eventosDelDia = this.eventosDesdeBD.filter(evento => {
        // Convertimos la fecha que viene del MySQL a objeto Date
        const fechaEvento = new Date(evento.fecha_inicio);
        return this.mismaFecha(fechaDeEstaCelda, fechaEvento);
      });

      this.celdasCalendario.push({ 
        numero: i, 
        esHueco: false,
        eventos: eventosDelDia 
      });
    }

    // Rellenar huecos finales (estético)
    while (this.celdasCalendario.length < 35) {
      this.celdasCalendario.push({ numero: '', esHueco: true, eventos: [] });
    }
  }

  mismaFecha(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  // --- 3. MINI CALENDARIO ---
  generarMiniCalendario() {
    this.diasMiniCalendario = [];
    const year = this.mesActualVisual.getFullYear();
    const month = this.mesActualVisual.getMonth();
    let primerDiaSemana = new Date(year, month, 1).getDay(); 
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; 
    const ultimoDiaMes = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < primerDiaSemana; i++) {
      this.diasMiniCalendario.push({ numero: '', esHueco: true });
    }
    for (let i = 1; i <= ultimoDiaMes; i++) {
      const esHoy = i === this.fechaActual.getDate() && month === this.fechaActual.getMonth() && year === this.fechaActual.getFullYear();
      this.diasMiniCalendario.push({ numero: i, esHueco: false, esHoy: esHoy });
    }
  }

  cambiarMes(direccion: number) {
    this.mesActualVisual.setMonth(this.mesActualVisual.getMonth() + direccion);
    this.mesActualVisual = new Date(this.mesActualVisual);
    this.generarMiniCalendario();
    this.generarCalendarioGrande(); // Importante regenerar ambos
  }

  seleccionarDia(dia: number) { console.log('Click:', dia); }
  toggleAjustes() { this.mostrarAjustes = !this.mostrarAjustes; }
}