import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  mostrarAjustes: boolean = false;
  
  fechaActual: Date = new Date(); 
  mesActualVisual: Date = new Date(); 
  
  nombresMeses: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  diasMiniCalendario: any[] = []; 
  celdasCalendario: any[] = [];
  eventosDesdeBD: any[] = [];   

  constructor(private calendarService: CalendarService, private router: Router) { }

  ngOnInit(): void {
    this.generarMiniCalendario();
    this.cargarEventos(); 
  }

  irACrearTarea() {
    this.router.navigate(['/crear-tarea']); 
  }

  // borrar tarea
  borrarTarea(id: number, evento: Event) {
    // Evitamos que el click se propague (si tuvieras click en la celda)
    evento.stopPropagation();

    const confirmar = confirm('¿Estás seguro de que quieres eliminar esta tarea?');
    if (confirmar) {
      this.calendarService.deleteActividad(id).subscribe({
        next: () => {
          // Si se borra bien, recargamos los eventos
          this.cargarEventos();
        },
        error: (e) => alert('Error al borrar la tarea')
      });
    }
  }

  cargarEventos() {
    this.calendarService.getActividades().subscribe({
      next: (datos: any) => {
        this.eventosDesdeBD = datos;
        this.generarCalendarioGrande(); 
      },
      error: (e: any) => console.error('Error cargando eventos:', e)
    });
  }

  generarCalendarioGrande() {
    this.celdasCalendario = [];
    const year = this.mesActualVisual.getFullYear();
    const month = this.mesActualVisual.getMonth();

    let primerDiaSemana = new Date(year, month, 1).getDay(); 
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; 

    const ultimoDiaMes = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < primerDiaSemana; i++) {
      this.celdasCalendario.push({ numero: '', esHueco: true, eventos: [] });
    }

    for (let i = 1; i <= ultimoDiaMes; i++) {
      const fechaDeEstaCelda = new Date(year, month, i);
      
      const eventosDelDia = this.eventosDesdeBD.filter((evento: any) => {
        const fechaEvento = new Date(evento.fecha_inicio);
        return this.mismaFecha(fechaDeEstaCelda, fechaEvento);
      });

      this.celdasCalendario.push({ 
        numero: i, 
        esHueco: false,
        eventos: eventosDelDia 
      });
    }

    while (this.celdasCalendario.length < 35) {
      this.celdasCalendario.push({ numero: '', esHueco: true, eventos: [] });
    }
  }

  mismaFecha(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

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
    this.generarCalendarioGrande(); 
  }

  seleccionarDia(dia: number) { console.log('Click:', dia); }
  toggleAjustes() { this.mostrarAjustes = !this.mostrarAjustes; }

}