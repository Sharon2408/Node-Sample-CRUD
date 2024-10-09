import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from 'src/services/products-service.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  products: Products[] = [];
  productForm!: FormGroup;
  visible:boolean = false;

  constructor(private productService: ProductsService,private fb: FormBuilder) { }
  ngOnInit(): void {
    this.getProducts();
    this.initForm();
  }

  initForm(){
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]] // Price must be greater than 0
    });
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



  get name() {
    return this.productForm.get('name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get price() {
    return this.productForm.get('price');
  }

  // Submit method to handle form submission
  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.value;

      // Call the service to post the data to the backend API
      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          // Optionally reset the form after successful submission
          this.productForm.reset();
          this.getProducts();
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}


export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
}