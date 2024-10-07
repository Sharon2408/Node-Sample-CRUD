import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ViewProductComponent } from './view-product/view-product.component';
import { TableModule } from 'primeng/table';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    ViewProductComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ]
})
export class ProductsModule { }
