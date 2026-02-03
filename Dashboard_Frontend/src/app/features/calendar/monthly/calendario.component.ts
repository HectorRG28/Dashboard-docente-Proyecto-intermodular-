import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../../../services/calendar.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../services/theme.service';
import { ModalService } from '../../../core/services/modal.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  mostrarAjustes: boolean = false;
  toggleAjustes() { this.mostrarAjustes = !this.mostrarAjustes; }
  cerrarAjustes() { this.mostrarAjustes = false; }
  
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

  // MENCIONES
  listaDocentes: any[] = [];
  filtroDocentes: string = '';
  currentUserId: number | null = null;
  modalMencionesAbierto: boolean = false;
  listaMenciones: any[] = [];

  // IMPORTACIÓN
  modalImportAbierto: boolean = false;
  pestanaImport: 'ARCHIVO' | 'WEB' = 'ARCHIVO';
  archivoImport: File | null = null;
  urlImport: string = '';

  // BÚSQUEDA AULAS
  modalBusquedaAbierto: boolean = false;
  busqueda = { fecha: '', inicio: '', fin: '' };
  aulasDisponibles: any[] | null = null;

  formularioTarea = {
    id: null as number | null,
    titulo: '', descripcion: '', 
    aula: '', menciones: [] as number[],
    fecha: '', horaInicio: '', horaFin: '', id_modulo_seleccionado: null as number | null, id_tipo: null as number | null
  };

  constructor(
    private calendarService: CalendarService, 
    private router: Router, 
    private themeService: ThemeService, 
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.themeService.timeFormat$.subscribe((fmt: '12h' | '24h') => {
      this.timeFormat = fmt;
    });

    this.authService.currentUser$.subscribe(u => {
      this.currentUserId = u ? u.id_usuario : null;
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
      error: (e) => this.modalService.open('Error al guardar: ' + e.message, 'error')
    });
  }

  activarModoEdicion() { 
    this.cargarDatosEnFormulario(this.tareaSeleccionada); 
    this.modoModal = 'EDITAR'; 
  }

  borrarTareaDesdeModal() { 
    this.modalService.openConfirm('¿Borrar esta tarea?', () => {
      this.calendarService.deleteActividad(this.tareaSeleccionada.id_actividad || this.tareaSeleccionada.id).subscribe(() => { 
        this.cerrarModal(); 
        this.cargarEventos(); 
      }); 
    });
  }

  // MENCIONES HELPERS
  get docentesFiltrados() {
    if (!this.filtroDocentes) return this.listaDocentes;
    const txt = this.filtroDocentes.toLowerCase();
    return this.listaDocentes.filter(d => 
       (d.nombre + ' ' + d.apellidos).toLowerCase().includes(txt)
    );
  }

  toggleMencion(idDocente: number) {
     const idx = this.formularioTarea.menciones.indexOf(idDocente);
     if (idx > -1) {
       this.formularioTarea.menciones.splice(idx, 1);
     } else {
       this.formularioTarea.menciones.push(idDocente);
     }
  }

  esMencionado(idDocente: number): boolean {
     return this.formularioTarea.menciones.includes(idDocente);
  }

  abrirModalMenciones() {
     if (!this.currentUserId) return;
     // Filtrar eventos donde soy mencionado
     this.listaMenciones = this.eventosDesdeBD.filter(e => {
       if (!e.ids_menciones) return false;
       const ids = e.ids_menciones.toString().split(',').map((x:string) => parseInt(x.trim()));
       return ids.includes(this.currentUserId);
     });
     this.modalMencionesAbierto = true;
  }

  cerrarModalMenciones() {
    this.modalMencionesAbierto = false;
  }

  private cargarDesplegables() {
    this.calendarService.getModulos().subscribe(m => this.listaModulos = m);
    this.calendarService.getTipos().subscribe(t => this.listaTipos = t);
    this.calendarService.getDocentes().subscribe((res: any) => this.listaDocentes = res.data);
  }

  private resetearFormulario() {
    // Default date to selected month/day or today
    const hoy = new Date().toISOString().split('T')[0];
    this.formularioTarea = { id: null, titulo: '', descripcion: '', aula: '', menciones: [], fecha: hoy, horaInicio: '09:00', horaFin: '', id_modulo_seleccionado: null, id_tipo: null };
  }

  private cargarDatosEnFormulario(t: any) {
    const f = new Date(t.fecha_inicio);
    const fFin = new Date(t.fecha_fin || t.fecha_inicio);
    
    // Parse menciones
    let mencionesIds: number[] = [];
    if (t.ids_menciones) {
        mencionesIds = t.ids_menciones.toString().split(',').map((id:string) => parseInt(id.trim()));
    }

    this.formularioTarea = { 
      id: t.id_actividad || t.id, titulo: t.titulo, descripcion: t.descripcion, 
      aula: t.aula, menciones: mencionesIds,
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
    this.router.navigate(['/dashboard']);
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
    this.modalService.openConfirm('¿Estás seguro de que quieres eliminar esta tarea?', () => {
      this.calendarService.deleteActividad(id).subscribe({
        next: () => { this.cargarEventos(); },
        error: (e) => this.modalService.open('Error al borrar la tarea', 'error')
      });
    });
  }

  // --- LOGOUT ---
  logout() {
    this.modalService.openConfirm('¿Seguro que quieres cerrar sesión?', () => {
      this.authService.logout();
    });
  }

  // --- IMPORTACIÓN ---
  abrirImport() { this.modalImportAbierto = true; this.pestanaImport = 'ARCHIVO'; this.archivoImport = null; this.urlImport = ''; }
  cerrarImport() { this.modalImportAbierto = false; }
  cambiarPestanaImport(pestana: 'ARCHIVO' | 'WEB') { this.pestanaImport = pestana; }
  
  onFileSelected(event: any) { this.archivoImport = event.target.files[0]; }
  
  confirmarImportarWeb() {
    if (!this.urlImport) { this.modalService.open('Ingresa una URL válida.', 'warning'); return; }
    this.calendarService.importWeb(this.urlImport).subscribe({
      next: (res: any) => { 
          this.modalService.open(res.message, 'success'); 
          this.cerrarImport(); 
          this.generarCalendarioGrande(); 
          this.cargarEventos(); 
      },
      error: (e: any) => {
         let mensaje = 'Error al importar desde web.';
         if (e.message.includes('Http failure')) mensaje = 'Error de conexión con el servidor.';
         else if (e.error?.message) mensaje = e.error.message;
         this.modalService.open(mensaje, 'error');
      }
    });
  }

  // --- BÚSQUEDA AULAS ---
  abrirBusqueda() { 
    this.modalBusquedaAbierto = true; 
    let today = new Date().toISOString().split('T')[0];
    this.busqueda = { fecha: today, inicio: '', fin: '' };
    this.aulasDisponibles = null;
  }
  cerrarBusqueda() { this.modalBusquedaAbierto = false; }
  
  buscarAulas() {
    if (!this.busqueda.fecha || !this.busqueda.inicio || !this.busqueda.fin) {
        this.modalService.open('Completa todos los campos.', 'warning');
        return;
    }
    this.calendarService.getAvailableAulas(this.busqueda.fecha, this.busqueda.inicio, this.busqueda.fin)
      .subscribe({
        next: (data) => this.aulasDisponibles = data,
        error: (e) => this.modalService.open('Error al buscar aulas.', 'error')
      });
  }

  usarAula(nombreAula: string) {
    this.cerrarBusqueda();
    this.abrirModalCrear();
    this.formularioTarea.aula = nombreAula;
    this.formularioTarea.fecha = this.busqueda.fecha;
    this.formularioTarea.horaInicio = this.busqueda.inicio;
    this.formularioTarea.horaFin = this.busqueda.fin;
  }

  confirmarImportarArchivo() {
    if (!this.archivoImport) {
        this.modalService.open('Selecciona un archivo primero.', 'warning');
        return;
    }
    
    this.calendarService.importFile(this.archivoImport).subscribe({
      next: (res: any) => { 
        this.modalService.open(res.message, 'success');
        this.cerrarImport();
        this.generarCalendarioGrande();
        this.cargarEventos();
      },
      error: (e: any) => {
         let mensaje = 'Error al importar archivo.';
         if (e.message.includes('Http failure')) mensaje = 'No se pudo conectar con el servidor.';
         else if (e.error?.message) mensaje = e.error.message;
         this.modalService.open(mensaje, 'error');
      }
    });
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

      // MARCAR MENCIONES
      eventosDelDia.forEach((ev: any) => {
          ev.esMencion = false;
          if (ev.ids_menciones && this.currentUserId) {
              const ids = ev.ids_menciones.toString().split(',').map((x:string) => parseInt(x.trim()));
              if (ids.includes(this.currentUserId)) {
                  ev.esMencion = true;
              }
          }
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

  formatTime(iso: string) {
      if (!iso) return '';
      const d = new Date(iso);
      return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
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
  
  // Duplicate toggleAjustes and formatTime removed from here.

}