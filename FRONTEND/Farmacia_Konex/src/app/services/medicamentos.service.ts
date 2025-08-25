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

export interface Venta {
  id: number;
  fechaHora: string;   // ✅ ya lo devuelve el backend
  medicamento: {
    id: number;
    nombre: string;
    laboratorio: string;
    fechaFabricacion: string;
    fechaVencimiento: string;
    cantidadStock: number;
    valorUnitario: number;
  };
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
}


@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {
  private baseUrl = 'http://localhost:8080/api/medicamentos';
  private ventaUrl = 'http://localhost:8080/api/ventas';

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

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.ventaUrl);
  }
  getVentasPorFechas(fechaInicio: string, fechaFin: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.ventaUrl}/filtrar?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
