import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from 'src/app/service/product.service';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.scss']
})
export class UpdateproductComponent implements OnInit {

  constructor(
    private productService:ProductService,
    private httpService:HttpService
  ) { }

  productList:Array<Product> = this.productService.getProducts();
  ngOnInit(): void {
    this.productService.productsChanged.subscribe(
      (products:Array<Product>)=>{
        this.productList = products;
      }
    )
  }

  delete(product:Product){
    var result = confirm("Want to delete?");
    if(result){
      this.httpService.deleteProduct(product).subscribe(
        (data:Product)=>{
          this.productService.removeProduct(data)
        }
      )
    }
  }
}
