import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkMode.asObservable();

  private timeFormat = new BehaviorSubject<'12h' | '24h'>('24h');
  timeFormat$ = this.timeFormat.asObservable();

  constructor() {
    this.cargarPreferencias();
  }

  toggleDarkMode() {
    const newVal = !this.darkMode.value;
    this.setDarkMode(newVal);
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    this.guardarPreferencias();
  }

  setTimeFormat(format: '12h' | '24h') {
    this.timeFormat.next(format);
    this.guardarPreferencias();
  }

  getTimeFormatValue() {
    return this.timeFormat.value;
  }

  private guardarPreferencias() {
    localStorage.setItem('preferencias_usuario', JSON.stringify({
      modo: this.darkMode.value,
      formato: this.timeFormat.value
    }));
  }

  private cargarPreferencias() {
    const memoria = localStorage.getItem('preferencias_usuario');
    if (memoria) {
      try {
        const datos = JSON.parse(memoria);
        // Aseguramos que se aplique el tema al cargar
        this.setDarkMode(!!datos.modo);
        if (datos.formato) this.timeFormat.next(datos.formato);
      } catch (e) {
        console.error('Error parsing preferences', e);
      }
    }
  }
}
