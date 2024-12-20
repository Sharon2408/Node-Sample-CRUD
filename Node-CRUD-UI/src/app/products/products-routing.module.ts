import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewSingleProductComponent } from './view-single-product/view-single-product.component';

const routes: Routes = [
  { path: '', component: ViewProductComponent },
  { path: 'view-single-product/:id', component: ViewSingleProductComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
