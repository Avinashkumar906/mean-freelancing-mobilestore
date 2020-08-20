import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductService } from 'src/app/service/product.service';
import { HttpService } from 'src/app/service/http.service';
import { DisposeBag } from '@ronas-it/dispose-bag';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.scss']
})
export class UpdateproductComponent implements OnInit, OnDestroy {

  dispBag = new DisposeBag();
  
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

  ngOnDestroy(): void {
		this.dispBag.unsubscribe()
	}

  delete(product:Product){
    var result = confirm("Want to delete?");
    if(result){
      this.dispBag.add(
        this.httpService.deleteProduct(product).subscribe(
          (data:Product)=>{
            this.productService.removeProduct(data)
          }
        )
      )
    }
  }
}
