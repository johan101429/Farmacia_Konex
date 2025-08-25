import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MedicamentosService, Venta } from '../../services/medicamentos.service';

// PrimeNG modernos (v20+)
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker'; // Nuevo nombre

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DatePicker  
  ],
  templateUrl: './ventas.html',
  styleUrls: ['./ventas.css']
})
export class Ventas implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  rangoFechas: Date[] | null = null;

  constructor(private medicamentosService: MedicamentosService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.medicamentosService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.ventasFiltradas = [...this.ventas];
      },
      error: (err) => console.error('Error cargando ventas', err)
    });
  }

  filtrarVentas(): void {
    if (this.rangoFechas && this.rangoFechas.length === 2) {
      const [inicio, fin] = this.rangoFechas;
      this.ventasFiltradas = this.ventas.filter(venta => {
        const fecha = new Date(venta.fechaHora);
        return fecha >= inicio && fecha <= fin;
      });
    } else {
      this.ventasFiltradas = [...this.ventas];
    }
  }

  limpiarFiltro(): void {
    this.rangoFechas = null;
    this.ventasFiltradas = [...this.ventas];
  }
}
