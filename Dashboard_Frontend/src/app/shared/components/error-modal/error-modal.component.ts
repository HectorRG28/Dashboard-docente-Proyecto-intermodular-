import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService, ModalState } from '../../../core/services/modal.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit, OnDestroy {
  state: ModalState = { show: false, message: '', type: 'error' };
  private subscription: Subscription = new Subscription();

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.subscription = this.modalService.state$.subscribe(state => {
      this.state = state;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.modalService.close();
  }

  confirm(): void {
    if (this.state.onConfirm) {
      this.state.onConfirm();
    }
    this.close();
  }



  // Helper to get title based on type
  get title(): string {
    switch (this.state.type) {
      case 'error': return 'Error';
      case 'warning': return 'Advertencia';
      case 'success': return 'Éxito';
      case 'info': return 'Información';
      case 'confirm': return 'Confirmar';
      default: return 'Aviso';
    }
  }

  // Helper to get color class or style
  get typeClass(): string {
      return `modal--${this.state.type}`;
  }
}
