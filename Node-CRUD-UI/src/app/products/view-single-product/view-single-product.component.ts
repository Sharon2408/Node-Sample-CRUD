import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Products } from 'src/models/products-model';
import { ProductsService } from 'src/services/products-service.service';

@Component({
  selector: 'app-view-single-product',
  templateUrl: './view-single-product.component.html',
  styleUrls: ['./view-single-product.component.css']
})
export class ViewSingleProductComponent implements OnInit {
  value1: number = 50;
  product!: Products;
  productImages: string[] = [];
  selectedImage: string = '';
  apiUrl = environment.authUrl;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.grtProductById();
  }
  onImageClick(image: string) {
    this.selectedImage = image;  // Set the clicked image as the selected image
  }
  grtProductById() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));  // Get product ID from route
    this.productService.getProductById(productId).subscribe({
      next: (data: Products) => {
        this.product = data;
        this.productImages = this.product.images.split(',');
        this.selectedImage = this.productImages[0];
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      }
    });
  }
}
