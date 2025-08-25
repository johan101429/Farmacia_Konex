import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Products } from '../products/products';
import { Medicamento, MedicamentosService } from '../../services/medicamentos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Datos de prueba
const mockMedicamento = {
  id: 1,
  nombre: 'Ibuprofeno',
  laboratorio: 'Bayer',
  fechaFabricacion: '2023-01-01',
  fechaVencimiento: '2025-01-01',
  cantidadStock: 50,
  valorUnitario: 5.50
};

// Mock para MedicamentosService
class MockMedicamentosService {
  getMedicamentos() {
    return of([mockMedicamento]);
  }
  agregarMedicamento(med:Medicamento) {
    return of(med);
  }
  actualizarMedicamento(med:Medicamento) {
    return of(med);
  }
  eliminarMedicamento(id:number) {
    return of({});
  }
  venderMedicamento(id:number, cantidad:number) {
    return of({});
  }
}

// Mock para ConfirmationService
class MockConfirmationService {
  confirm(confirmation: any) {
    // Llama a la función 'accept' para simular la confirmación del usuario
    confirmation.accept();
  }
}

// Mock para MessageService
class MockMessageService {
  add(message: any) {
    console.log('MessageService called:', message);
  }
}

describe('Products Component', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let medicamentosService: MedicamentosService;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products], // Usamos el componente standalone
      providers: [
        { provide: MedicamentosService, useClass: MockMedicamentosService },
        { provide: ConfirmationService, useClass: MockConfirmationService },
        { provide: MessageService, useClass: MockMessageService },
      ],
      // Ignoramos los errores de componentes de PrimeNG en la plantilla
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    medicamentosService = TestBed.inject(MedicamentosService);
    messageService = TestBed.inject(MessageService);
    confirmationService = TestBed.inject(ConfirmationService);
    
    fixture.detectChanges();
  });

  // Prueba 1: Verifica que el componente se cree correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 2: Verifica la carga inicial de productos
  it('should call cargarProductos on ngOnInit', () => {
    spyOn(component, 'cargarProductos');
    component.ngOnInit();
    expect(component.cargarProductos).toHaveBeenCalled();
  });

  // Prueba 3: Simula la carga de productos exitosa
  it('should load products successfully', fakeAsync(() => {
    spyOn(medicamentosService, 'getMedicamentos').and.returnValue(of([mockMedicamento]));
    component.cargarProductos();
    tick(); // Simula el paso del tiempo para que el observable se complete
    expect(component.productos.length).toBe(1);
    expect(component.productos[0]).toEqual(mockMedicamento);
  }));

  // Prueba 4: Maneja errores al cargar productos
  it('should handle error when loading products', () => {
    spyOn(medicamentosService, 'getMedicamentos').and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.cargarProductos();
    expect(console.error).toHaveBeenCalled();
  });
  
  // Prueba 5: Lógica para agregar un nuevo producto
  it('should set isNewProduct to true and open dialog when adding a new product', () => {
    component.agregarProducto();
    expect(component.isNewProduct).toBeTrue();
    expect(component.selectedMed).not.toBeNull();
    expect(component.displayEditDialog).toBeTrue();
  });

  // Prueba 6: Lógica para editar un producto existente
  it('should set isNewProduct to false and open dialog when editing a product', () => {
    component.editarProducto(mockMedicamento);
    expect(component.isNewProduct).toBeFalse();
    expect(component.selectedMed).toEqual(mockMedicamento);
    expect(component.displayEditDialog).toBeTrue();
  });

  // Prueba 7: Guardar una edición (actualización)
  it('should call actualizarMedicamento and show a success message when saving an existing product', fakeAsync(() => {
    spyOn(medicamentosService, 'actualizarMedicamento').and.returnValue(of(mockMedicamento));
    spyOn(messageService, 'add');
    
    component.isNewProduct = false;
    component.selectedMed = mockMedicamento;
    component.guardarEdicion();
    
    tick();
    expect(medicamentosService.actualizarMedicamento).toHaveBeenCalledWith(mockMedicamento);
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    expect(component.displayEditDialog).toBeFalse();
  }));

  // Prueba 8: Guardar una adición (nuevo producto)
  it('should call agregarMedicamento and show a success message when saving a new product', fakeAsync(() => {
    spyOn(medicamentosService, 'agregarMedicamento').and.returnValue(of(mockMedicamento));
    spyOn(messageService, 'add');
    
    component.isNewProduct = true;
    component.selectedMed = mockMedicamento;
    component.guardarEdicion();
    
    tick();
    expect(medicamentosService.agregarMedicamento).toHaveBeenCalledWith(mockMedicamento);
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    expect(component.displayEditDialog).toBeFalse();
  }));

  // Prueba 9: Eliminar un producto
  it('should call eliminarMedicamento and show a success message when confirming deletion', fakeAsync(() => {
    spyOn(medicamentosService, 'eliminarMedicamento').and.returnValue(of({}));
    spyOn(messageService, 'add');
    
    component.eliminarProducto(mockMedicamento);
    tick();
    
    expect(medicamentosService.eliminarMedicamento).toHaveBeenCalledWith(mockMedicamento.id);
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
  }));

  // Prueba 10: Lógica para vender un producto
  it('should confirm and call venderMedicamento when selling a product', fakeAsync(() => {
    spyOn(medicamentosService, 'venderMedicamento').and.returnValue(of({}));
    spyOn(confirmationService, 'confirm').and.callThrough();
    spyOn(messageService, 'add');
    
    component.selectedMed = mockMedicamento;
    component.cantidadVender = 1;
    component.confirmarVenta();
    
    tick();
    
    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(medicamentosService.venderMedicamento).toHaveBeenCalledWith(mockMedicamento.id, 1);
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    expect(component.displaySaleDialog).toBeFalse();
  }));

  // Prueba 11: Manejo de errores al vender un producto
  it('should handle error when selling a product', fakeAsync(() => {
    spyOn(medicamentosService, 'venderMedicamento').and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    spyOn(messageService, 'add');
    
    component.selectedMed = mockMedicamento;
    component.cantidadVender = 1;
    component.confirmarVenta();
    
    tick();
    
    expect(medicamentosService.venderMedicamento).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error' }));
    expect(component.displaySaleDialog).toBeFalse();
  }));
});