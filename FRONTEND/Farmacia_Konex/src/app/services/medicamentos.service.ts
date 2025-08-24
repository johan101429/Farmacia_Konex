import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicamento {
  id: number;
  nombre: string;
  laboratorio: string;
  fechaFabricacion: string;
  fechaVencimiento: string;
  cantidadStock: number;
  valorUnitario: number;
  
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {
  private baseUrl = 'http://localhost:8080/api/medicamentos';

  constructor(private http: HttpClient) {}

  getMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.baseUrl);
  }

  venderMedicamento(id: number, cantidad: number): Observable<any> {
    return this.http.post(`http://localhost:8080/api/ventas?medicamentoId=${id}&cantidad=${cantidad}`, {});
  }


  actualizarMedicamento(med: Medicamento) {
  return this.http.put<Medicamento>(`http://localhost:8080/api/medicamentos/${med.id}`, med);
  }

  agregarMedicamento(med: Medicamento): Observable<Medicamento> {
    
    return this.http.post<Medicamento>(this.baseUrl, med);
  }


  eliminarMedicamento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
