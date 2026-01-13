import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario-semanal',
  templateUrl: './calendario-semanal.component.html',
  styleUrls: ['./calendario-semanal.component.scss']
})
export class CalendarioSemanalComponent implements OnInit {

  // --- VARIABLES DE FECHA Y NAVEGACIÓN ---
  fechaActual: Date = new Date();
  fechaSeleccionada: Date = new Date(); 
  mesActualVisual: Date = new Date();
  
  diasMiniCalendario: any[] = [];
  nombresMeses: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // --- VARIABLES HORARIO SEMANAL ---
  lunes: any[] = [];
  martes: any[] = [];
  miercoles: any[] = [];
  jueves: any[] = [];
  viernes: any[] = [];

  diasCabecera: { nombre: string, numero: number, fechaCompleta: Date }[] = [];

  // --- VARIABLES DEL POPUP (MODAL TAREAS) ---
  modalAbierto: boolean = false;
  modoModal: 'VER' | 'CREAR' | 'EDITAR' = 'VER';
  tareaSeleccionada: any = null;
  listaModulos: any[] = [];
  listaTipos: any[] = [];

  formularioTarea = {
    id: null as number | null,
    titulo: '',
    descripcion: '',
    aula: '', 
    fecha: '',
    horaInicio: '',
    id_modulo_seleccionado: null as number | null,
    id_tipo: null as number | null
  };

  // --- NUEVAS VARIABLES: AJUSTES ---
  modalAjustesAbierto: boolean = false;
  isDarkMode: boolean = false;
  timeFormat: string = '24h';

  constructor(private calendarService: CalendarService, private router: Router) {}

  ngOnInit(): void {
    this.fechaSeleccionada = new Date(); 
    
    // 0. Cargar Preferencias (Tema Oscuro)
    this.cargarPreferencias();
    this.aplicarTema();

    // 1. Cargar datos auxiliares (Desplegables)
    this.cargarDesplegables();

    // 2. Generar calendarios
    this.generarMiniCalendario();
    this.calcularFechasSemana(); 
    
    // 3. Cargar tareas
    this.cargarDatosSemana();
  }

  // ==========================================
  // NAVEGACIÓN Y FECHAS
  // ==========================================
  seleccionarDia(dia: number) {
    this.fechaSeleccionada = new Date(this.mesActualVisual.getFullYear(), this.mesActualVisual.getMonth(), dia);
    this.calcularFechasSemana();
    this.generarMiniCalendario();
    this.cargarDatosSemana();
  }

  calcularFechasSemana() {
    this.diasCabecera = [];
    const nombres = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
    
    const refDate = new Date(this.fechaSeleccionada);
    const diaSemana = refDate.getDay(); 
    const distanciaAlLunes = diaSemana === 0 ? 6 : diaSemana - 1;

    const lunesFecha = new Date(refDate);
    lunesFecha.setDate(refDate.getDate() - distanciaAlLunes);

    for (let i = 0; i < 5; i++) {
      const fechaDia = new Date(lunesFecha);
      fechaDia.setDate(lunesFecha.getDate() + i);
      
      this.diasCabecera.push({
        nombre: nombres[i],
        numero: fechaDia.getDate(),
        fechaCompleta: fechaDia 
      });
    }
  }

  // ==========================================
  // CARGA DE DATOS
  // ==========================================
  cargarDatosSemana() {
    this.calendarService.getActividades().subscribe({
      next: (datos: any[]) => this.clasificarPorDias(datos),
      error: (e) => console.error('Error cargando tareas:', e)
    });
  }

  clasificarPorDias(tareas: any[]) {
    this.lunes = []; this.martes = []; this.miercoles = []; this.jueves = []; this.viernes = [];

    const inicioSemana = new Date(this.diasCabecera[0].fechaCompleta);
    inicioSemana.setHours(0, 0, 0, 0);
    const finSemana = new Date(this.diasCabecera[4].fechaCompleta);
    finSemana.setHours(23, 59, 59, 999);

    tareas.forEach(tarea => {
      if (!tarea.fecha_inicio) return;
      const fechaTarea = new Date(tarea.fecha_inicio);

      if (fechaTarea >= inicioSemana && fechaTarea <= finSemana) {
        
        const diaSemana = fechaTarea.getDay(); 
        const horaStr = fechaTarea.getHours().toString().padStart(2, '0') + ':' + 
                        fechaTarea.getMinutes().toString().padStart(2, '0');

        const tareaVisual = {
          id: tarea.id_actividad || tarea.id,
          hora: horaStr,
          titulo: tarea.titulo || tarea.nombre_modulo || 'Sin título',
          descripcion: tarea.descripcion,
          aula: tarea.aula || '', 
          original: tarea 
        };

        if (diaSemana === 1) this.lunes.push(tareaVisual);
        else if (diaSemana === 2) this.martes.push(tareaVisual);
        else if (diaSemana === 3) this.miercoles.push(tareaVisual);
        else if (diaSemana === 4) this.jueves.push(tareaVisual);
        else if (diaSemana === 5) this.viernes.push(tareaVisual);
      }
    });
    
    const ordenar = (a: any, b: any) => a.hora.localeCompare(b.hora);
    this.lunes.sort(ordenar); this.martes.sort(ordenar); this.miercoles.sort(ordenar);
    this.jueves.sort(ordenar); this.viernes.sort(ordenar);
  }

  getListaPorIndice(index: number): any[] {
    const dias = [this.lunes, this.martes, this.miercoles, this.jueves, this.viernes];
    return dias[index] || [];
  }

  // ==========================================
  // GESTIÓN DE MODALES (TAREAS)
  // ==========================================
  abrirModalCrear() {
    this.modoModal = 'CREAR';
    this.resetearFormulario();
    this.modalAbierto = true;
  }

  abrirModalVer(tareaVisual: any) {
    this.tareaSeleccionada = tareaVisual;
    this.modoModal = 'VER';
    this.modalAbierto = true;
  }

  abrirModalEditarDirecto(event: Event, tareaVisual: any) {
    event.stopPropagation();
    this.tareaSeleccionada = tareaVisual;
    this.activarModoEdicion();
    this.modalAbierto = true;
  }

  borrarTareaDirecta(event: Event, id: number) {
    event.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.calendarService.deleteActividad(id).subscribe({
        next: () => this.cargarDatosSemana(),
        error: () => alert('Error al borrar la tarea')
      });
    }
  }

  activarModoEdicion() {
    if (!this.tareaSeleccionada) return;
    this.cargarDatosEnFormulario(this.tareaSeleccionada);
    this.modoModal = 'EDITAR';
  }

  borrarTareaDesdeModal() {
    if (!this.tareaSeleccionada) return;
    if(confirm('¿Borrar tarea?')) {
        this.calendarService.deleteActividad(this.tareaSeleccionada.id).subscribe({
            next: () => { this.cerrarModal(); this.cargarDatosSemana(); },
            error: () => alert('Error al borrar')
        });
    }
  }

  cerrarModal() { this.modalAbierto = false; }

  // ==========================================
  // NUEVO: GESTIÓN DE AJUSTES Y MODO OSCURO
  // ==========================================
  verAulasLibres() {
    alert('🔍 Buscando aulas libres...');
    // Aquí tu lógica futura
  }

  abrirAjustes() { this.modalAjustesAbierto = true; }
  cerrarAjustes() { this.modalAjustesAbierto = false; }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.aplicarTema();
    this.guardarPreferencias();
  }

  setFormat(format: string) {
    this.timeFormat = format;
    this.guardarPreferencias();
  }

  private aplicarTema() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  private guardarPreferencias() {
    localStorage.setItem('preferencias_usuario', JSON.stringify({
      modo: this.isDarkMode,
      formato: this.timeFormat
    }));
  }

  private cargarPreferencias() {
    const memoria = localStorage.getItem('preferencias_usuario');
    if (memoria) {
      const datos = JSON.parse(memoria);
      this.isDarkMode = datos.modo;
      this.timeFormat = datos.formato || '24h';
    }
  }

  // ==========================================
  // FORMULARIO Y GUARDADO
  // ==========================================
  resetearFormulario() {
    const fechaDefecto = this.diasCabecera.length > 0 
        ? this.diasCabecera[0].fechaCompleta.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];

    this.formularioTarea = {
        id: null,
        titulo: '',
        descripcion: '',
        aula: '',
        fecha: fechaDefecto,
        horaInicio: '09:00',
        id_modulo_seleccionado: null,
        id_tipo: null
    };
  }

  cargarDatosEnFormulario(tareaVisual: any) {
    const original = tareaVisual.original || tareaVisual;
    let fechaStr = ''; let horaStr = '';
    
    if (original.fecha_inicio) {
        const fechaObj = new Date(original.fecha_inicio);
        fechaStr = fechaObj.toISOString().split('T')[0];
        horaStr = fechaObj.getHours().toString().padStart(2, '0') + ':' + 
                  fechaObj.getMinutes().toString().padStart(2, '0');
    }

    this.formularioTarea = {
        id: original.id_actividad || original.id,
        titulo: original.titulo,
        descripcion: original.descripcion,
        aula: original.aula || '',
        fecha: fechaStr,
        horaInicio: horaStr,
        id_modulo_seleccionado: original.id_asignacion || original.id_modulo,
        id_tipo: original.id_tipo
    };
  }

  guardarTarea() {
    if (!this.formularioTarea.titulo || !this.formularioTarea.fecha || !this.formularioTarea.id_modulo_seleccionado || !this.formularioTarea.id_tipo) {
        alert('Por favor, rellena el título, la fecha, el módulo y el tipo.');
        return;
    }
    
    const fechaSQL = `${this.formularioTarea.fecha} ${this.formularioTarea.horaInicio}:00`;
    
    const payload = {
        titulo: this.formularioTarea.titulo,
        descripcion: this.formularioTarea.descripcion,
        aula: this.formularioTarea.aula, 
        fecha_inicio: fechaSQL,
        fecha_fin: fechaSQL,
        id_tipo: this.formularioTarea.id_tipo,
        id_estado: 1, 
        id_asignacion: this.formularioTarea.id_modulo_seleccionado,
        creado_por: 1, 
        peso: 0,
        id_periodo: null
    };

    if (this.modoModal === 'CREAR') {
        this.calendarService.createActividad(payload).subscribe({
            next: () => { this.cerrarModal(); this.cargarDatosSemana(); },
            error: (e) => {
              console.error(e);
              alert('Error al crear. Revisa la consola.');
            }
        });
    } else if (this.modoModal === 'EDITAR' && this.formularioTarea.id) {
        this.calendarService.updateActividad(this.formularioTarea.id, payload).subscribe({
            next: () => { this.cerrarModal(); this.cargarDatosSemana(); },
            error: (e) => {
              console.error(e);
              alert('Error al actualizar. Revisa la consola.');
            }
        });
    }
  }

  cargarDesplegables() {
    this.calendarService.getModulos().subscribe(data => {
        this.listaModulos = data;
    });
    this.calendarService.getTipos().subscribe(data => {
        this.listaTipos = data;
    });
  }

  // ==========================================
  // MINI CALENDARIO
  // ==========================================
  generarMiniCalendario() {
    this.diasMiniCalendario = [];
    const year = this.mesActualVisual.getFullYear();
    const month = this.mesActualVisual.getMonth();
    
    let primerDiaSemana = new Date(year, month, 1).getDay();
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
    const ultimoDiaMes = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < primerDiaSemana; i++) this.diasMiniCalendario.push({ numero: '', esHueco: true });
    
    for (let i = 1; i <= ultimoDiaMes; i++) {
      const esSeleccionado = i === this.fechaSeleccionada.getDate() && 
                             month === this.fechaSeleccionada.getMonth() && 
                             year === this.fechaSeleccionada.getFullYear();
      
      this.diasMiniCalendario.push({ numero: i, esHueco: false, esHoy: esSeleccionado });
    }
  }

  cambiarMes(direccion: number) {
    this.mesActualVisual.setMonth(this.mesActualVisual.getMonth() + direccion);
    this.mesActualVisual = new Date(this.mesActualVisual);
    this.generarMiniCalendario();
  }
}