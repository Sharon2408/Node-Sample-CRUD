import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetail } from 'src/app/profile/profile/profile.component';
import { AuthService } from 'src/services/auth-service.service';
import { ProductsService } from 'src/services/products-service.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  products: Products[] = [];
  productsTable: Products[] = [];
  productForm!: FormGroup;
  visible: boolean = false;
  first: number = 1;
  cardRows: number = 12;
  currentPage: number = 1;
  totalPages: number = 0;
  userDetail: UserDetail = {
    id: 0,
    name: '',
    email: '',
    profile_image: '',
    isAdmin: 0
  };


  constructor(private productService: ProductsService, private fb: FormBuilder, public authService: AuthService) { }
  ngOnInit(): void {
    this.getProducts(this.currentPage,this.cardRows);
    this.initForm();
    this.getUserDetail();
  }




  getUserDetail() {
    this.authService.getUserDetail().subscribe({
      next: (res) => {
        console.log(res);

        this.userDetail = res;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }



  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]] // Price must be greater than 0
    });
  }

  getProducts(page: number,rows:number) {
    this.productService.getProducts(page,rows).subscribe({
      next: (data: any) => {
        this.products = data.products;
        this.productsTable = data.totalProducts;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
      }
    });
  }



  onRowEditInit(product: Products) {

  }

  onRowEditSave(product: Products) {
    this.productService.editProduct(product, product.id).subscribe({
      next: (res) => {
        console.log(res);
        this.getProducts(this.currentPage,this.cardRows);
      }
    })
  }

  onRowEditCancel(product: Products, index: number) {
    this.getProducts(this.currentPage,this.cardRows);

    //   delete this.clonedProducts[product.id as string];
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
          this.getProducts(this.currentPage,this.cardRows);
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  onPageChange(event: PageEvent | any): void {
    this.getProducts(event.page+1,this.cardRows);
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
}


export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}