import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss']
})
export class AjustesComponent implements OnInit, OnChanges {

  @Input() embed: boolean = false; // Si es true, se muestra en versión "mini" para modal
  @Input() isDarkInput: boolean | null = null; // Override opcional del estado dark mode

  isDarkMode: boolean = false;
  timeFormat: string = '24h';

  constructor(private themeService: ThemeService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDarkInput']) {
      console.error('PROPAGATION DEBUG - Ajustes: Input changed:', this.isDarkInput);
    }
  }

  ngOnInit(): void {
    console.error('PROPAGATION DEBUG - Ajustes: Init. isDarkInput:', this.isDarkInput);
    
    // Nos suscribimos al servicio para estar sincronizados
    this.themeService.isDarkMode$.subscribe(val => {
       console.error('PROPAGATION DEBUG - Ajustes: Service value:', val);
       this.isDarkMode = val;
    });
    this.themeService.timeFormat$.subscribe(val => this.timeFormat = val);
  }

  toggleDarkMode() {
    console.log('PROPAGATION DEBUG - Ajustes: Toggling from', this.isDarkMode);
    this.themeService.toggleDarkMode();
  }

  setFormat(format: '12h' | '24h') {
    this.themeService.setTimeFormat(format);
  }
}