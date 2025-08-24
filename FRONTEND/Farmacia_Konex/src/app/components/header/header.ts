import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  standalone: true,              
  imports: [RouterModule, MenubarModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']     
})
export class Header {
  items = [
    { label: 'Inicio', icon: 'pi pi-home', routerLink: ['/'] },
    { label: 'Inventario', icon: 'pi pi-list', routerLink: ['/inventario'] },
    { label: 'Ventas', icon: 'pi pi-shopping-cart', routerLink: ['/ventas'] },
    { label: 'Clientes', icon: 'pi pi-users', routerLink: ['/clientes'] }
  ];
}
  