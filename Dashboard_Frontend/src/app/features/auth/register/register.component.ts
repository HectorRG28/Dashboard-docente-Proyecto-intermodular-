import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss'] // Reutilizamos estilos
})
export class RegisterComponent {
  nombre = '';
  apellidos = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private modalService: ModalService) {}

  register() {
    if (!this.nombre || !this.apellidos || !this.email || !this.password) {
      this.modalService.open('Por favor, completa todos los campos', 'warning');
      return;
    }

    this.authService.register({
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.modalService.open('Registro exitoso. Por favor inicia sesión.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.mensaje || 'Error al registrar';
        this.modalService.open(msg, 'error');
      }
    });
  }
}
