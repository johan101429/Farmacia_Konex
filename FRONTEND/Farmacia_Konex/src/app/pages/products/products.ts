// products.ts

import { Component, OnInit } from '@angular/core';
import { MedicamentosService, Medicamento } from '../../services/medicamentos.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    HttpClientModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    DecimalPipe,
    ConfirmationService,
    MessageService,
    MedicamentosService
  ]
})
export class Products implements OnInit {
  productos: Medicamento[] = [];
  filterText: string = '';
  displayEditDialog: boolean = false;
  selectedMed: Medicamento | null = null; 
  isNewProduct: boolean = false;
  displaySaleDialog: boolean = false;
  cantidadVender: number = 1;
  valorTotalPagar: number = 0;

  constructor(
    private medicamentosService: MedicamentosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  
  agregarProducto() {
    this.isNewProduct = true; 
    this.selectedMed = { 
      id: 0, 
      nombre: '', 
      laboratorio: '',
      fechaFabricacion: '',
      fechaVencimiento: '',
      cantidadStock: 0,
      valorUnitario: 0
    };
    this.displayEditDialog = true; 
  }

  
  editarProducto(med: Medicamento) {
    this.isNewProduct = false; 
    this.selectedMed = { ...med };
    this.displayEditDialog = true;
  }

  
  guardarEdicion() {
    if (this.selectedMed) {
      if (this.isNewProduct) {
        // Lógica para AGREGAR un nuevo producto
        this.medicamentosService.agregarMedicamento(this.selectedMed)
          .subscribe({
            next: () => {
              this.displayEditDialog = false;
              this.cargarProductos();
              this.messageService.add({
                severity: 'success',
                summary: 'Agregado',
                detail: `El medicamento ${this.selectedMed?.nombre} fue agregado`
              });
            },
            error: (err: any) => {
              console.error('Error agregando medicamento', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo agregar el medicamento'
              });
            }
          });
      } else {
        
        this.medicamentosService.actualizarMedicamento(this.selectedMed)
          .subscribe({
            next: () => {
              this.displayEditDialog = false;
              this.cargarProductos();
              this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: `El medicamento ${this.selectedMed?.nombre} fue actualizado`
              });
            },
            error: (err: any) => {
              console.error('Error actualizando medicamento', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el medicamento'
              });
            }
          });
      }
    }
  }


  cargarProductos(): void {
    this.medicamentosService.getMedicamentos()
      .subscribe({
        next: (data) => this.productos = data,
        error: (err: any) => console.error('Error cargando medicamentos', err)
      });
  }

  cancelarEdicion() {
    this.displayEditDialog = false;
  }

  eliminarProducto(med: Medicamento) {
    this.confirmationService.confirm({
      message: `¿Seguro que quieres eliminar "${med.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.medicamentosService.eliminarMedicamento(med.id)
          .subscribe({
            next: () => {
              this.cargarProductos();
              this.messageService.add({
                severity: 'success',
                summary: 'Eliminado',
                detail: `El medicamento ${med.nombre} fue eliminado`
              });
            },
            error: (err: any) => console.error('Error eliminando medicamento', err)
          });
      }
    });
  }
  abrirDialogoVenta(med: Medicamento) {
    this.selectedMed = { ...med };
    this.cantidadVender = 1;
    this.calcularValorTotal();
    this.displaySaleDialog = true;
  }

  calcularValorTotal() {
    if (this.selectedMed && this.cantidadVender > 0) {
      this.valorTotalPagar = this.selectedMed.valorUnitario * this.cantidadVender;
    } else {
      this.valorTotalPagar = 0;
    }
  }

  cancelarVenta() {
    this.displaySaleDialog = false;
  }

  confirmarVenta() {
    if (!this.selectedMed || this.cantidadVender <= 0 || this.cantidadVender > this.selectedMed.cantidadStock) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Cantidad no válida'});
      return;
    }

    this.confirmationService.confirm({
      message: `¿Confirmas la venta de ${this.cantidadVender} unidades de "${this.selectedMed.nombre}" por un total de $${this.valorTotalPagar.toFixed(2)}?`,
      header: 'Confirmar Venta',
      icon: 'pi pi-check',
      accept: () => {
        this.medicamentosService.venderMedicamento(this.selectedMed!.id, this.cantidadVender).subscribe({
          next: () => {
            this.cargarProductos();
            this.displaySaleDialog = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Venta Registrada',
              detail: `
                Venta exitosa:
                Fecha y Hora: ${new Date().toLocaleString()}
                Medicamento: ${this.selectedMed!.nombre}
                Cantidad: ${this.cantidadVender}
                Valor Unitario: $${this.selectedMed!.valorUnitario}
                Valor Total: $${this.valorTotalPagar.toFixed(2)}
              `
            });
          },
          error: (err: any) => {
            console.error('Error en la venta:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message || 'No se pudo registrar la venta'
            });
          }
        });
      }
    });
  }
}