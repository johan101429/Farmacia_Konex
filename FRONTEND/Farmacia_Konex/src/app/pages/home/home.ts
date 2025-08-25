import { Component } from '@angular/core';
import { Products } from '../products/products'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Products], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}
