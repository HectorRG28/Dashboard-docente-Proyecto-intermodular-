import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

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

  timeFormat: '12h' | '24h' = '24h';

  // MODAL STATE
  modalAbierto: boolean = false;
  modoModal: 'VER' | 'CREAR' | 'EDITAR' = 'VER';
  tareaSeleccionada: any = null;

  listaModulos: any[] = [];
  listaTipos: any[] = [];

  formularioTarea = {
    id: null as number | null,
    titulo: '', descripcion: '', 
    aula: '', 
    fecha: '', horaInicio: '', horaFin: '', id_modulo_seleccionado: null as number | null, id_tipo: null as number | null
  };

  constructor(private calendarService: CalendarService, private router: Router, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.timeFormat$.subscribe((fmt: '12h' | '24h') => {
      this.timeFormat = fmt;
    });
    this.cargarDesplegables();
    this.generarMiniCalendario();
    this.generarCalendarioGrande(); 
    this.cargarEventos(); 
  }

  // MODALES
  abrirModalCrear() { 
    this.modoModal = 'CREAR'; 
    this.resetearFormulario(); 
    this.modalAbierto = true; 
  }

  abrirModalVer(evento: any) { 
    this.tareaSeleccionada = evento; 
    this.modoModal = 'VER'; 
    this.modalAbierto = true; 
  }
  
  cerrarModal() { this.modalAbierto = false; }

  guardarTarea() {
    const fSQL = `${this.formularioTarea.fecha} ${this.formularioTarea.horaInicio}:00`;
    const fSQLFin = this.formularioTarea.horaFin ? `${this.formularioTarea.fecha} ${this.formularioTarea.horaFin}:00` : fSQL; // Si no hay fin, igual a inicio
    
    const p = {
      titulo: this.formularioTarea.titulo,
      descripcion: this.formularioTarea.descripcion,
      aula: this.formularioTarea.aula, 
      fecha_inicio: fSQL, fecha_fin: fSQLFin,
      id_tipo: this.formularioTarea.id_tipo, id_asignacion: this.formularioTarea.id_modulo_seleccionado,
      id_estado: 1, creado_por: 1
    };

    const obs = this.modoModal === 'CREAR' 
      ? this.calendarService.createActividad(p) 
      : this.calendarService.updateActividad(this.formularioTarea.id!, p);

    obs.subscribe({
      next: () => { 
        this.cerrarModal(); 
        this.cargarEventos(); 
      },
      error: (e) => alert('Error al guardar: ' + e.message)
    });
  }

  activarModoEdicion() { 
    this.cargarDatosEnFormulario(this.tareaSeleccionada); 
    this.modoModal = 'EDITAR'; 
  }

  borrarTareaDesdeModal() { 
    if(confirm('¿Borrar esta tarea?')) {
      this.calendarService.deleteActividad(this.tareaSeleccionada.id_actividad || this.tareaSeleccionada.id).subscribe(() => { 
        this.cerrarModal(); 
        this.cargarEventos(); 
      }); 
    }
  }

  private cargarDesplegables() {
    this.calendarService.getModulos().subscribe(m => this.listaModulos = m);
    this.calendarService.getTipos().subscribe(t => this.listaTipos = t);
  }

  private resetearFormulario() {
    // Default date to selected month/day or today
    const hoy = new Date().toISOString().split('T')[0];
    this.formularioTarea = { id: null, titulo: '', descripcion: '', aula: '', fecha: hoy, horaInicio: '09:00', horaFin: '', id_modulo_seleccionado: null, id_tipo: null };
  }

  private cargarDatosEnFormulario(t: any) {
    const f = new Date(t.fecha_inicio);
    const fFin = new Date(t.fecha_fin || t.fecha_inicio);
    this.formularioTarea = { 
      id: t.id_actividad || t.id, titulo: t.titulo, descripcion: t.descripcion, 
      aula: t.aula, 
      fecha: f.toISOString().split('T')[0], 
      horaInicio: f.getHours().toString().padStart(2, '0') + ':' + f.getMinutes().toString().padStart(2, '0'), 
      horaFin: fFin.getHours().toString().padStart(2, '0') + ':' + fFin.getMinutes().toString().padStart(2, '0'),
      id_modulo_seleccionado: t.id_asignacion || t.modulo_id, id_tipo: t.id_tipo 
    };
  }

  irACrearTarea() {
    this.abrirModalCrear(); 
  }

  irAMiHorario() {
    this.router.navigate(['/calendario-semanal']);
  }

  irAHoy() {
    this.mesActualVisual = new Date();
    this.generarMiniCalendario();
    this.generarCalendarioGrande();
    this.cargarEventos(); // Recargar por si acaso
  }

  // borrar tarea
  borrarTarea(id: number, evento: Event) {
    evento.stopPropagation();
    const confirmar = confirm('¿Estás seguro de que quieres eliminar esta tarea?');
    if (confirmar) {
      this.calendarService.deleteActividad(id).subscribe({
        next: () => { this.cargarEventos(); },
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
    // No hace falta recargar eventos si son todos, pero si fuera por mes sí.
    // Asumimos que getActividades trae todo o filtramos en cliente.
    // Si quisieras ser eficiente, cargarías solo el mes.
  }

  seleccionarDia(dia: number) { 
    console.log('Click en día:', dia); 
    // Podría abrir el modal de crear pre-rellenando la fecha
    this.formularioTarea.fecha = new Date(this.mesActualVisual.getFullYear(), this.mesActualVisual.getMonth(), dia).toISOString().split('T')[0];
    // Opcional: abrir modal directo
    // this.abrirModalCrear();
  }
  
  toggleAjustes() { this.mostrarAjustes = !this.mostrarAjustes; }

  formatTime(fechaInput: string | Date): string {
    const date = new Date(fechaInput);
    if (this.timeFormat === '24h') {
      return date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0');
    } else {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2,'0')} ${ampm}`;
    }
  }

}