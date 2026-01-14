import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario-semanal',
  templateUrl: './calendario-semanal.component.html',
  styleUrls: ['./calendario-semanal.component.scss']
})
export class CalendarioSemanalComponent implements OnInit {

  fechaSeleccionada: Date = new Date(); 
  mesActualVisual: Date = new Date();
  diasMiniCalendario: any[] = [];
  nombresMeses: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  lunes: any[] = []; martes: any[] = []; miercoles: any[] = []; jueves: any[] = []; viernes: any[] = [];
  diasCabecera: any[] = [];

  modalAbierto: boolean = false;
  modoModal: 'VER' | 'CREAR' | 'EDITAR' = 'VER';
  modalAjustesAbierto: boolean = false;
  tareaSeleccionada: any = null;
  
  isDarkMode: boolean = false;
  listaModulos: any[] = [];
  listaTipos: any[] = [];

  // HE RECUPERADO EL CAMPO AULA AQUÍ
  formularioTarea = {
    id: null as number | null,
    titulo: '', descripcion: '', 
    aula: '', // <--- IMPORTANTE
    fecha: '', horaInicio: '', id_modulo_seleccionado: null as number | null, id_tipo: null as number | null
  };

  constructor(private calendarService: CalendarService, private router: Router) {}

  ngOnInit(): void {
    this.cargarPreferencias();
    this.aplicarTema();
    this.cargarDesplegables();
    this.irAHoy(); 
  }

  irACalendario() {
    this.router.navigate(['/calendario-mensual']); 
  }

  irAHoy() {
    this.fechaSeleccionada = new Date();
    this.mesActualVisual = new Date();
    this.refrescarVistaCompleta();
    window.scrollTo(0, 0);
  }

  seleccionarDia(dia: number) {
    // Actualizamos la fecha seleccionada al hacer clic
    this.fechaSeleccionada = new Date(this.mesActualVisual.getFullYear(), this.mesActualVisual.getMonth(), dia);
    this.refrescarVistaCompleta();
  }

  cambiarMes(direccion: number) {
    this.mesActualVisual.setMonth(this.mesActualVisual.getMonth() + direccion);
    this.mesActualVisual = new Date(this.mesActualVisual);
    this.generarMiniCalendario();
  }

  private refrescarVistaCompleta() {
    this.generarMiniCalendario();
    this.calcularFechasSemana();
    this.cargarDatosSemana();
  }

  // --- AQUÍ ESTABA EL ERROR DEL CALENDARIO ---
  generarMiniCalendario() {
    this.diasMiniCalendario = [];
    const year = this.mesActualVisual.getFullYear();
    const month = this.mesActualVisual.getMonth();
    
    let primerDiaSemana = new Date(year, month, 1).getDay();
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
    const ultimoDiaMes = new Date(year, month + 1, 0).getDate();

    // Días vacíos previos
    for (let i = 0; i < primerDiaSemana; i++) {
      this.diasMiniCalendario.push({ numero: '', esHueco: true });
    }

    // Días del mes
    const hoy = new Date();
    for (let i = 1; i <= ultimoDiaMes; i++) {
      // 1. ¿Es el día que hemos clicado?
      const esSeleccionado = (i === this.fechaSeleccionada.getDate() && 
                              month === this.fechaSeleccionada.getMonth() && 
                              year === this.fechaSeleccionada.getFullYear());
      
      // 2. ¿Es hoy (fecha real)?
      const esHoyReal = (i === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear());

      this.diasMiniCalendario.push({ 
        numero: i, 
        esHueco: false, 
        esSeleccionado: esSeleccionado, // Para el círculo azul
        esHoy: esHoyReal // Para marcar el día actual (opcional)
      });
    }
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
      this.diasCabecera.push({ nombre: nombres[i], numero: fechaDia.getDate(), fechaCompleta: fechaDia });
    }
  }

  cargarDatosSemana() {
    this.calendarService.getActividades().subscribe({
      next: (datos) => this.clasificarPorDias(datos),
      error: (e) => console.error(e)
    });
  }

  clasificarPorDias(tareas: any[]) {
    this.lunes = []; this.martes = []; this.miercoles = []; this.jueves = []; this.viernes = [];
    const inicio = new Date(this.diasCabecera[0].fechaCompleta); inicio.setHours(0,0,0,0);
    const fin = new Date(this.diasCabecera[4].fechaCompleta); fin.setHours(23,59,59,999);

    tareas.forEach(t => {
      const f = new Date(t.fecha_inicio);
      if (f >= inicio && f <= fin) {
        const item = {
          id: t.id_actividad || t.id,
          titulo: t.titulo || t.nombre_modulo,
          aula: t.aula, // Recuperado
          descripcion: t.descripcion,
          hora: f.getHours().toString().padStart(2,'0') + ':' + f.getMinutes().toString().padStart(2,'0'),
          original: t
        };
        const d = f.getDay();
        if (d === 1) this.lunes.push(item);
        else if (d === 2) this.martes.push(item);
        else if (d === 3) this.miercoles.push(item);
        else if (d === 4) this.jueves.push(item);
        else if (d === 5) this.viernes.push(item);
      }
    });
    const ord = (a: any, b: any) => a.hora.localeCompare(b.hora);
    [this.lunes, this.martes, this.miercoles, this.jueves, this.viernes].forEach(l => l.sort(ord));
  }

  getListaPorIndice(i: number) { return [this.lunes, this.martes, this.miercoles, this.jueves, this.viernes][i] || []; }

  // MODALES
  abrirModalCrear() { this.modoModal = 'CREAR'; this.resetearFormulario(); this.modalAbierto = true; }
  abrirModalVer(t: any) { this.tareaSeleccionada = t; this.modoModal = 'VER'; this.modalAbierto = true; }
  
  abrirModalEditarDirecto(e: Event, t: any) {
    e.stopPropagation();
    this.tareaSeleccionada = t;
    this.cargarDatosEnFormulario(t);
    this.modoModal = 'EDITAR';
    this.modalAbierto = true;
  }
  
  cerrarModal() { this.modalAbierto = false; }
  abrirAjustes() { this.modalAjustesAbierto = true; }
  cerrarAjustes() { this.modalAjustesAbierto = false; }

  guardarTarea() {
    const fSQL = `${this.formularioTarea.fecha} ${this.formularioTarea.horaInicio}:00`;
    // INCLUIMOS AULA EN EL PAYLOAD
    const p = {
      titulo: this.formularioTarea.titulo,
      descripcion: this.formularioTarea.descripcion,
      aula: this.formularioTarea.aula, 
      fecha_inicio: fSQL, fecha_fin: fSQL,
      id_tipo: this.formularioTarea.id_tipo, id_asignacion: this.formularioTarea.id_modulo_seleccionado,
      id_estado: 1, creado_por: 1
    };
    const obs = this.modoModal === 'CREAR' ? this.calendarService.createActividad(p) : this.calendarService.updateActividad(this.formularioTarea.id!, p);
    obs.subscribe(() => { this.cerrarModal(); this.cargarDatosSemana(); });
  }

  borrarTareaDirecta(e: Event, id: number) {
    e.stopPropagation();
    if (confirm('¿Eliminar?')) this.calendarService.deleteActividad(id).subscribe(() => this.cargarDatosSemana());
  }

  activarModoEdicion() { this.cargarDatosEnFormulario(this.tareaSeleccionada); this.modoModal = 'EDITAR'; }
  borrarTareaDesdeModal() { this.calendarService.deleteActividad(this.tareaSeleccionada.id).subscribe(() => { this.cerrarModal(); this.cargarDatosSemana(); }); }

  toggleDarkMode() { 
    this.isDarkMode = !this.isDarkMode; 
    this.aplicarTema();
    localStorage.setItem('dark-mode', JSON.stringify(this.isDarkMode));
  }

  private aplicarTema() { 
    if(this.isDarkMode) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }
  private cargarPreferencias() { this.isDarkMode = JSON.parse(localStorage.getItem('dark-mode') || 'false'); }
  private cargarDesplegables() {
    this.calendarService.getModulos().subscribe(m => this.listaModulos = m);
    this.calendarService.getTipos().subscribe(t => this.listaTipos = t);
  }
  private resetearFormulario() {
    this.formularioTarea = { id: null, titulo: '', descripcion: '', aula: '', fecha: this.fechaSeleccionada.toISOString().split('T')[0], horaInicio: '09:00', id_modulo_seleccionado: null, id_tipo: null };
  }
  private cargarDatosEnFormulario(t: any) {
    const o = t.original || t;
    const f = new Date(o.fecha_inicio);
    this.formularioTarea = { 
      id: o.id_actividad || o.id, titulo: o.titulo, descripcion: o.descripcion, 
      aula: o.aula, // RECUPERADO AL CARGAR
      fecha: f.toISOString().split('T')[0], horaInicio: f.getHours().toString().padStart(2, '0') + ':' + f.getMinutes().toString().padStart(2, '0'), id_modulo_seleccionado: o.id_asignacion, id_tipo: o.id_tipo 
    };
  }
}