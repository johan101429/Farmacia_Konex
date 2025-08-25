import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Ventas } from './pages/ventas/ventas';


export const routes: Routes = [

    {path:"", component:Home},
    {path: 'Productos', component: Products},
    { path: 'ventas', component: Ventas },
    {path: '**', redirectTo: ''}
        


];
