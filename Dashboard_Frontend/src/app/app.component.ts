import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent implements OnInit {
  title = 'Dashboard_Frontend';

  // Inyectamos ActivatedRoute para poder leer la URL
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Nos suscribimos a los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const token = params['token']; // Buscamos si viene algo llamado 'token'
      
      if (token) {
        // SI HAY TOKEN: Lo guardamos en el navegador
        console.log('Token recibido:', token);
        localStorage.setItem('jwt_token', token);
      }
    });
  }
}