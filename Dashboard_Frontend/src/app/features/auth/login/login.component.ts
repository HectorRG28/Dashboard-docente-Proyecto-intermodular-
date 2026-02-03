import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private modalService: ModalService) {}

  login() {
    if (!this.email || !this.password) {
      this.modalService.open('Por favor, ingresa email y contraseña', 'warning');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err.error?.mensaje || 'Error al iniciar sesión';
        this.modalService.open(msg, 'error');
      }
    });
  }
}
