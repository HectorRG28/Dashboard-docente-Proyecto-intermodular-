import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  
  // Injector is used to avoid Cyclic Dependency error with ModalService
  constructor(private injector: Injector, private zone: NgZone) {}

  handleError(error: any): void {
    const modalService = this.injector.get(ModalService);
    
    // Extract message
    let message = 'Ha ocurrido un error inesperado.';
    
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = error.error?.message || error.message || 'Error de conexión con el servidor.';
    } else if (error instanceof Error) {
      // Client error
      message = error.message;
    } else {
        message = error.toString();
    }

    console.error('GlobalErrorHandler captured:', error);

    // Run inside NgZone to ensure UI updates
    this.zone.run(() => {
      modalService.open(message, 'error');
    });
  }
}
