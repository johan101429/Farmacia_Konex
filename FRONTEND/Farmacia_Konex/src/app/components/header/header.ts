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
    { label: 'Inventario', routerLink: '/' },
    { label: 'Ventas', routerLink: '/ventas' }
  ];
}
  