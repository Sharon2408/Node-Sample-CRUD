import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/services/products-service.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  products: Products[] = [];

  constructor(private productService: ProductsService) { }
  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
      }
    });
  }

  onRowEditInit(product: Products) {

  }

  onRowEditSave(product: Products) {
    this.productService.editProduct(product, product.id).subscribe({
      next: (res) => {
        console.log(res);
        this.getProducts();
      }
    })
  }

  onRowEditCancel(product: Products, index: number) {

    //   delete this.clonedProducts[product.id as string];
  }
}


export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
}