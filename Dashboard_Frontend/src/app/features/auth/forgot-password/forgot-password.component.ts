import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private authService: AuthService, private modalService: ModalService, private router: Router) {}

  submit() {
    if (!this.email) {
      this.modalService.open('Ingresa tu email', 'warning');
      return;
    }

    this.authService.recoverPassword(this.email).subscribe({
      next: (res: any) => {
        this.modalService.open(res.mensaje, 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
         this.modalService.open(err.error?.mensaje || 'Error al solicitar recuperación', 'error');
      }
    });
  }
}
