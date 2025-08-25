import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MedicamentosService, Venta } from '../../services/medicamentos.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    TableModule,
    ButtonModule
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas implements OnInit {
  
  ventas: Venta[] = [];
  

  constructor(private medicamentosService: MedicamentosService) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.medicamentosService.getVentas().subscribe({
      next: (data) => this.ventas = data,
      error: (err) => console.error('Error cargando ventas', err)
    });
  }
}
