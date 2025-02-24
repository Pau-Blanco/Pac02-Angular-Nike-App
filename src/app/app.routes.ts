import { Routes } from '@angular/router';
import { ProductosComponent } from './components/productos/productos.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'productos', component: ProductosComponent},
    {path: 'admin', component: AdminComponent}];
