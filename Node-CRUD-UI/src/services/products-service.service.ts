import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { } from 'src/app/products/view-product/view-product.component';
import { environment } from 'src/environments/environment';
import { Products,PageEvent } from 'src/models/products-model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  public getProducts(page: PageEvent|any,rows:number): Observable<Products> {
    return this.http.get<Products>(`${this.apiUrl}/products?page=${page}&noOfRecords=${rows}`)
  }

  public editProduct(product: Products, id: number): Observable<Products> {
  return  this.http.put<Products>(`${this.apiUrl}/products/${id}`, product)
  }


  public createProduct(product:FormData): Observable<Products>{
    
    return  this.http.post<Products>(`${this.apiUrl}/products`, product)
  }

  getProductById(id: number): Observable<Products> {
    return this.http.get<Products>(`${this.apiUrl}/products/${id}`);
  }
}
