import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';


export const routes: Routes = [

    {path:"", component:Home},
    {path: 'Productos', component: Products},
    {path: '**', redirectTo: ''}
        


];
