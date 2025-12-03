import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.scss']
})
export class CrearTareaComponent implements OnInit {

  mostrarPopup: boolean = false;
  
  // Usamos 'any' para evitar líos de tipos de TypeScript
  listaModulos: any[] = [];
  listaTipos: any[] = [];

  nuevaTarea = {
    titulo: '',
    descripcion: '',
    fecha: '',       
    horaInicio: '',  
    id_modulo_seleccionado: null, // Guardamos el ID del modulo
    id_tipo: null
  };

  constructor(private calendarService: CalendarService, private router: Router) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargar Módulos
    this.calendarService.getModulos().subscribe({
      next: (data: any) => { 
        this.listaModulos = data;
        // Seleccionar el primero por defecto
        if (this.listaModulos.length > 0) {
            this.nuevaTarea.id_modulo_seleccionado = this.listaModulos[0].id_modulo; 
        }
      },
      error: (e: any) => console.error('Error cargando módulos:', e)
    });

    // 2. Cargar Tipos
    this.calendarService.getTipos().subscribe({
      next: (data: any) => { 
        this.listaTipos = data;
        if (this.listaTipos.length > 0) {
          this.nuevaTarea.id_tipo = this.listaTipos[0].id_tipo;
        }
      },
      error: (e: any) => console.error('Error cargando tipos:', e)
    });
  }

  guardarTarea() {
    if (!this.nuevaTarea.titulo || !this.nuevaTarea.fecha || 
        !this.nuevaTarea.horaInicio || !this.nuevaTarea.id_modulo_seleccionado || !this.nuevaTarea.id_tipo) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const fechaInicioSQL = `${this.nuevaTarea.fecha} ${this.nuevaTarea.horaInicio}:00`;
    const fechaFinSQL = fechaInicioSQL; 

    
    const payload = {
      titulo: this.nuevaTarea.titulo,
      descripcion: this.nuevaTarea.descripcion,
      fecha_inicio: fechaInicioSQL,
      fecha_fin: fechaFinSQL,
      id_tipo: this.nuevaTarea.id_tipo,
      id_estado: 1,      // 1 = Pendiente
      id_asignacion: this.nuevaTarea.id_modulo_seleccionado, 
      creado_por: 1,     // ID del profesor
      peso: 0,           
      id_periodo: null   
    };

    console.log('Enviando:', payload);

    this.calendarService.createActividad(payload).subscribe({
      next: (res: any) => {
        alert('¡Tarea guardada con éxito!');
        this.router.navigate(['/dashboard']); 
      },
      error: (err: any) => {
        console.error('Error al guardar:', err);
        alert('Hubo un error al guardar.');
      }
    });
  }

  abrirPopup() { this.mostrarPopup = true; }
  cerrarPopup() { this.mostrarPopup = false; }
}