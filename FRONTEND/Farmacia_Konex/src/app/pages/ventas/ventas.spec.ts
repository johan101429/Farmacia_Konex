import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Ventas } from '../ventas/ventas';
import { MedicamentosService, Venta } from '../../services/medicamentos.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Datos de prueba para simular el historial de ventas
const mockVentas: Venta[] = [
  {
		id: 1, fechaHora: new Date('2024-05-21T11:00:00Z'),medicamento: {"id": 3,nombre: "Claritromicina-3",laboratorio: "Abbott",fechaFabricacion: "2024-06-30",fechaVencimiento: "2026-06-30",
			cantidadStock: 47, valorUnitario: 1800.0 }, cantidad: 3, valorUnitario: 1800.0, valorTotal: 5400.0 	},
{
		id: 2, fechaHora: new Date('2024-05-21T11:00:00Z'),medicamento: {"id": 6,nombre: "Claritromicina-2",laboratorio: "Abbott",fechaFabricacion: "2024-06-30",fechaVencimiento: "2026-06-30",
			cantidadStock: 47, valorUnitario: 1800.0 }, cantidad: 3, valorUnitario: 1800.0, valorTotal: 5400.0 	},
      {
		id: 3, fechaHora: new Date('2024-05-21T11:00:00Z'),medicamento: {"id": 9,nombre: "Claritromicina-1",laboratorio: "Abbott",fechaFabricacion: "2024-06-30",fechaVencimiento: "2026-06-30",
			cantidadStock: 47, valorUnitario: 1800.0 }, cantidad: 3, valorUnitario: 1800.0, valorTotal: 5400.0 	},
];

// Mock para el servicio para simular respuestas de la API
class MockMedicamentosService {
  getVentas() {
    return of(mockVentas);
  }
}

describe('Ventas Component', () => {
  let component: Ventas;
  let fixture: ComponentFixture<Ventas>;
  let medicamentosService: MedicamentosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ventas], // Usamos el componente standalone
      providers: [
        { provide: MedicamentosService, useClass: MockMedicamentosService },
      ],
      // Ignoramos los errores de componentes de PrimeNG en la plantilla
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Ventas);
    component = fixture.componentInstance;
    medicamentosService = TestBed.inject(MedicamentosService);
    
    fixture.detectChanges();
  });

  // Prueba 1: Verifica que el componente se cree correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  // Prueba 2: Simula la carga de ventas exitosa
  it('should load ventas on ngOnInit and initialize ventasFiltradas', fakeAsync(() => {
    spyOn(medicamentosService, 'getVentas').and.returnValue(of(mockVentas));
    component.ngOnInit();
    tick(); // Simula el paso del tiempo para que el observable se complete
    expect(component.ventas.length).toBe(3);
    expect(component.ventas).toEqual(mockVentas);
    expect(component.ventasFiltradas).toEqual(mockVentas);
  }));

  // Prueba 3: Maneja errores al cargar ventas
  it('should handle error when loading ventas', () => {
    spyOn(medicamentosService, 'getVentas').and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.cargarVentas();
    expect(console.error).toHaveBeenCalled();
  });
  
  // Prueba 4: Filtra las ventas por rango de fechas
  it('should filter ventas by date range', () => {
    // Inicializa el componente con datos de prueba
    component.ventas = mockVentas;
    component.ventasFiltradas = [...mockVentas];
    
    // Define el rango de fechas para la prueba
    const fechaInicio = new Date('2024-05-21T00:00:00Z');
    const fechaFin = new Date('2024-05-22T23:59:59Z');
    component.rangoFechas = [fechaInicio, fechaFin];
    
    component.filtrarVentas();
    
    // Esperamos que solo se incluyan las ventas del 21 y 22 de mayo
    expect(component.ventasFiltradas.length).toBe(2);
    expect(component.ventasFiltradas[0].id).toBe(2);
    expect(component.ventasFiltradas[1].id).toBe(3);
  });
  
  // Prueba 5: No aplica filtro si el rango de fechas es inválido
  it('should not filter ventas if date range is null', () => {
    component.ventas = mockVentas;
    component.ventasFiltradas = [];
    component.rangoFechas = null;
    
    component.filtrarVentas();
    
    expect(component.ventasFiltradas.length).toBe(3);
    expect(component.ventasFiltradas).toEqual(component.ventas);
  });
  
  // Prueba 6: Lógica para limpiar el filtro
  it('should clear the filter and restore all ventas', () => {
    component.ventas = mockVentas;
    component.ventasFiltradas = [mockVentas[0]];
    component.rangoFechas = [new Date(), new Date()];
    
    component.limpiarFiltro();
    
    expect(component.rangoFechas).toBeNull();
    expect(component.ventasFiltradas.length).toBe(3);
    expect(component.ventasFiltradas).toEqual(component.ventas);
  });
  
});