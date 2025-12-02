// src/app/services/calendar.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  // La URL de tu backend
  private apiUrl = 'http://localhost:3000/api/actividades';

  constructor(private http: HttpClient) { }

  // 1. OBTENER ACTIVIDADES (GET)
  getActividades(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Tu backend devuelve un objeto complejo { ok: true, data: [...] }
      // Aquí le decimos a Angular que solo nos interesa la parte de 'data'
      map(response => {
        if (response.ok) {
          return response.data;
        } else {
          return [];
        }
      })
    );
  }

  // 2. CREAR ACTIVIDAD (POST)
  createActividad(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }
}