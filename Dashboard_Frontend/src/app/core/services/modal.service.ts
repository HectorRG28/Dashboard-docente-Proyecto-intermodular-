import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalState {
  show: boolean;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private stateSubject = new BehaviorSubject<ModalState>({
    show: false,
    message: '',
    type: 'error'
  });

  public state$: Observable<ModalState> = this.stateSubject.asObservable();

  constructor() { }

  open(message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error') {
    this.stateSubject.next({
      show: true,
      message,
      type
    });
  }

  close() {
    this.stateSubject.next({
      show: false,
      message: '',
      type: 'error'
    });
  }
}
