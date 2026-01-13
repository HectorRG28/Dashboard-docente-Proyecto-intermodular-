import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss']
})
export class AjustesComponent implements OnInit {

  // Variables de estado
  isDarkMode: boolean = false;
  timeFormat: string = '24h'; // Por defecto 24h

  constructor() { }

  ngOnInit(): void {
    // AL INICIAR: Leemos la memoria del navegador
    this.cargarPreferencias();
    this.aplicarTema();
  }

  // --- FUNCIONES ---

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.aplicarTema();
    this.guardarPreferencias();
  }

  setFormat(format: string) {
    this.timeFormat = format;
    this.guardarPreferencias();
    console.log('Formato cambiado a:', this.timeFormat);
  }

  // --- LÓGICA INTERNA (PRIVADA) ---

  // Pinta la web de negro si está activado
  private aplicarTema() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  // Guarda en la memoria del navegador
  private guardarPreferencias() {
    localStorage.setItem('preferencias_usuario', JSON.stringify({
      modo: this.isDarkMode,
      formato: this.timeFormat
    }));
  }

  // Recupera de la memoria
  private cargarPreferencias() {
    const memoria = localStorage.getItem('preferencias_usuario');
    if (memoria) {
      const datos = JSON.parse(memoria);
      this.isDarkMode = datos.modo;
      this.timeFormat = datos.formato;
    }
  }
}