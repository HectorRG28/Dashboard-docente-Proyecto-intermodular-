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

  importFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import/file`, formData);
  }

  importWeb(url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/import/web`, { url });
  }

  getAvailableAulas(fecha: string, inicio: string, fin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/actividades-evaluables/aulas-disponibles`, {
      params: { fecha, inicio, fin }
    });
  }

  getDocentes(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }
}