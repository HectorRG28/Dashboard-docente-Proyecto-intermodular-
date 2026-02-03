import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss']
})
export class AjustesComponent implements OnInit {

  @Input() embed: boolean = false; // Si es true, se muestra en versión "mini" para modal

  isDarkMode: boolean = false;
  timeFormat: string = '24h';

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    // Nos suscribimos al servicio para estar sincronizados
    this.themeService.isDarkMode$.subscribe(val => this.isDarkMode = val);
    this.themeService.timeFormat$.subscribe(val => this.timeFormat = val);
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  setFormat(format: '12h' | '24h') {
    this.themeService.setTimeFormat(format);
  }
}