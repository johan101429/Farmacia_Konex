import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';   
import { ButtonModule } from 'primeng/button';

interface Product {
  name: string;
  stock: number;
  price: number;
  category: string;
  supplier: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, ButtonModule, DecimalPipe],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  
})
export class Products {
  filterText: string = '';

  products: Product[] = [
    { name: 'Paracetamol', stock: 50, price: 3.5, category: 'Analgesico', supplier: 'Farmacia ABC' },
    { name: 'Ibuprofeno', stock: 20, price: 5.2, category: 'Antiinflamatorio', supplier: 'Farmacia XYZ' },
    { name: 'Amoxicilina', stock: 15, price: 12, category: 'Antibiotico', supplier: 'Farmacia ABC' },
    { name: 'Loratadina', stock: 30, price: 7.8, category: 'Antihistaminico', supplier: 'Farmacia 123' },
    { name: 'Omeprazol', stock: 25, price: 10.5, category: 'Inhibidor de bomba de protones', supplier: 'Farmacia XYZ' },
    { name: 'Metformina', stock: 40, price: 8.3, category: 'Antidiabetico', supplier: 'Farmacia ABC' },
    { name: 'Aspirina', stock: 60, price: 4.0, category: 'Antipiretico', supplier: 'Farmacia 123' },
    { name: 'Cetirizina', stock: 35, price: 6.7, category: 'Antihistaminico', supplier: 'Farmacia XYZ' },
    { name: 'Diclofenaco', stock: 10, price: 9.1, category: 'Antiinflamatorio', supplier: 'Farmacia ABC' },
    { name: 'Claritromicina', stock: 18, price: 14.2, category: 'Antibiotico', supplier: 'Farmacia 123' },
    { name: 'Salbutamol', stock: 22, price: 11.5, category: 'Broncodilatador', supplier: 'Farmacia XYZ' },
    { name: 'Hidroxicloroquina', stock: 12, price: 15.0, category: 'Antimalarico', supplier: 'Farmacia ABC' },
    { name: 'Fluconazol', stock: 28, price: 13.4, category: 'Antifungico', supplier: 'Farmacia 123' },
    { name: 'Prednisona', stock: 16, price: 9.8, category: 'Corticosteroide', supplier: 'Farmacia XYZ' },
    { name: 'Ranitidina', stock: 45, price: 7.2, category: 'Antagonista H2', supplier: 'Farmacia ABC' }

    
  ];
  venderProducto(product: any) {
    if (product.stock > 0) {
      product.stock--;
      console.log(`Se vendió 1 unidad de ${product.name}. Stock actual: ${product.stock}`);
    } else {
      console.warn(`No hay stock disponible de ${product.name}`);
    }
  }

  editarProducto(product: any) {
    console.log('Editar producto:', product);
    // Aquí puedes abrir un modal o redirigir a una página de edición
  }

  eliminarProducto(product: any) {
    this.products = this.products.filter(p => p !== product);
    console.log('Producto eliminado:', product.name);
  }

  get filteredProducts(): Product[] {
    if (!this.filterText) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      p.category.toLowerCase().includes(this.filterText.toLowerCase()) ||
      p.supplier.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
}
