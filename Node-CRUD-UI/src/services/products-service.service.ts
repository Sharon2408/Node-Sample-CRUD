import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent, Products } from 'src/app/products/view-product/view-product.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  public getProducts(page: PageEvent|any,rows:number) {
    return this.http.get<Products>(`${this.apiUrl}/products?page=${page}&noOfRecords=${rows}`)
  }

  public editProduct(product: Products, id: number) {
  return  this.http.put<Products>(`${this.apiUrl}/products/${id}`, product)
  }


  public createProduct(product:Products){
    return  this.http.post<Products>(`${this.apiUrl}/products`, product)
  }


}
