import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from 'src/app/service/product.service';
import * as _ from 'lodash'
import { environment } from 'src/environments/environment';
import { OrderService } from 'src/app/service/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {

  constructor(
    private productService:ProductService,
    private orderService:OrderService,
    private router:Router,
    ) { }
    
  productList:Array<Product> = this.productService.getProducts();
  env = environment;
  key:string = '';

  ngOnInit(): void {
    this.productService.productsChanged.subscribe(
      (products:Array<Product>)=>this.productList = _.cloneDeep(products)
    )
  }

  buyNow(product:Product){
    let dummy = _.cloneDeep(product)
    dummy.quantity = 1;
    if(this.productService.removeQuantity(dummy)){
      this.orderService.addToOrder(dummy)
    } else {
      alert('out of stock !')
    }
    this.router.navigate(['/checkout']);
  }

}
