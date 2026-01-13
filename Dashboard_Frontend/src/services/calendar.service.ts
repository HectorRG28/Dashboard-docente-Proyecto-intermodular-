import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  getModulos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/modulos`);
  }

  getTipos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tipos-actividad`);
  }

  createActividad(actividad: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/actividades-evaluables`, actividad);
  }

  getActividades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/actividades-evaluables`);
  }
 //Funcion para borrar
  deleteActividad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/actividades-evaluables/${id}`);
  }
  updateActividad(id: number, actividad: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actividades-evaluables/${id}`, actividad);
  }
}