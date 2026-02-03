import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.modalService.open('Token inválido o no proporcionado', 'error');
      this.router.navigate(['/login']);
    }
  }

  reset() {
    if (!this.newPassword) {
      this.modalService.open('Ingresa una nueva contraseña', 'warning');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res: any) => {
        this.modalService.open('Contraseña cambiada con éxito', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.modalService.open(err.error?.mensaje || 'Error al cambiar contraseña', 'error');
      }
    });
  }
}
