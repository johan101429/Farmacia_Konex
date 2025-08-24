import { Component, OnInit } from '@angular/core';
import { Medicamento } from '../../services/medicamentos.service';
import { CommonModule,DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService,MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule }  from 'primeng/toast';


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
    MessageService
  
  
  ]
})
export class Products implements OnInit {
  productos: Medicamento[] = [];
  filterText: string = '';

  // Modal de edición
  displayEditDialog: boolean = false;  
  selectedMed: Medicamento | null = null; 

  constructor(private http: HttpClient,
              private confirmationService: ConfirmationService,
              private messageService: MessageService  
   ) {}
  

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.http.get<Medicamento[]>('http://localhost:8080/api/medicamentos')
      .subscribe({
        next: (data) => this.productos = data,
        error: (err: any) => console.error('Error cargando medicamentos', err)
      });
  }

 editarProducto(med: Medicamento) {
    this.selectedMed = { ...med }; // Clonamos para no modificar directamente
    this.displayEditDialog = true;
  }

  guardarEdicion() {
    if (this.selectedMed) {
      this.http.put(`http://localhost:8080/api/medicamentos/${this.selectedMed.id}`, this.selectedMed)
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
          error: (err: any) => console.error('Error actualizando medicamento', err)
        });
    }
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
        this.http.delete(`http://localhost:8080/api/medicamentos/${med.id}`)
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
}

  

