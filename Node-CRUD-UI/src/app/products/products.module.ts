import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ViewProductComponent } from './view-product/view-product.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { ViewSingleProductComponent } from './view-single-product/view-single-product.component';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    ViewProductComponent,
    ViewSingleProductComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CardModule,
    PaginatorModule,
    InputNumberModule,
  ]
})
export class ProductsModule { }
