import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetail } from 'src/app/profile/profile/profile.component';
import { environment } from 'src/environments/environment';
import { PageEvent, Products } from 'src/models/products-model';
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
  productImages: string[] | void = [];
  imagePreviews: string[] = [];
  selectedImages: File[] = [];
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
  apiUrl = environment.authUrl;
  @ViewChild('productFile') productFile!: ElementRef;

  // Error message for file type validation
  fileTypeError: string = '';

  constructor(private productService: ProductsService, private fb: FormBuilder, public authService: AuthService) { }

  ngOnInit(): void {
    this.getProducts(this.currentPage, this.cardRows);
    this.initForm();
    this.getUserDetail();
  }


  load() {
    this.productFile.nativeElement.click()
  }

  getUserDetail() {
    this.authService.getUserDetail().subscribe({
      next: (res) => {
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
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  getProducts(page: number, rows: number) {
    this.productService.getProducts(page, rows).subscribe({
      next: (data: any) => {
        this.products = data.totalProducts;
        this.productsTable = data.totalProducts;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.productImages = this.products.forEach((img)=>{img.images.split(",")})
      }
    });
  }

  onRowEditInit(product: Products) { }

  onRowEditSave(product: Products) {
    this.productService.editProduct(product, product.id).subscribe({
      next: (res) => {
        console.log(res);
        this.getProducts(this.currentPage, this.cardRows);
      }
    });
  }

  onRowEditCancel(product: Products, index: number) {
    this.getProducts(this.currentPage, this.cardRows);
  }

  // File validation: Only images (png, jpeg, jpg, gif) are allowed
  onFileSelect(event: any): void {
    const files = event.target.files;
    this.imagePreviews = [];
    this.selectedImages = [];
    this.fileTypeError = '';  // Reset error message

    if (files) {
      for (let file of files) {
        const fileType = file.type;

        // Check if the file is an image
        if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/gif') {
          this.selectedImages.push(file);  // Store valid image files

          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result);  // Store the preview URL
          };
          reader.readAsDataURL(file);  // Convert the file to DataURL for preview
        } else {
          this.fileTypeError = 'Only image files (png, jpg, jpeg, gif) are allowed.';
          break;
        }
      }
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.selectedImages.length === 0) {
      // Display an error message if no images are selected
      if (this.selectedImages.length === 0) {
        this.fileTypeError = 'Please select at least one image.';
      }
      return;
    }

    const formData = new FormData() as FormData;
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);

    this.selectedImages.forEach((file) => {
      formData.append('images', file);  // Correct: append all files under the same key 'images'
    });
    


    this.uploadProduct(formData);
  }

  uploadProduct(formData: FormData) {
    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.productForm.reset();
        this.imagePreviews = [];  // Reset image previews
        this.selectedImages = [];  // Reset selected images
        this.fileTypeError = '';  // Reset file error
        this.getProducts(this.currentPage, this.cardRows);
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }

  onPageChange(event: PageEvent | any): void {
    this.getProducts(event.page + 1, this.cardRows);
  }

  // Getter functions for form controls
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



