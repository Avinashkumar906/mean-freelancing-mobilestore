import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from 'src/app/service/product.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment';
import { OrderService } from 'src/app/service/order.service';
import * as _ from 'lodash'

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.scss']
})
export class ProductdetailComponent implements OnInit {

  product:Product;
  error:any;
  id:string;
  env = environment;

  constructor(
    private productService:ProductService,
    private orderService:OrderService,
    private route:ActivatedRoute,
    private httpService:HttpService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (param)=>{
        this.id = param.id
        this.loadProduct()
      }
    )
  }

  loadProduct(){
    if(!this.productService.getProduct(this.id)){
      this.httpService.getProduct(this.id).subscribe(
        (product:Product)=>{
          this.product=product
        },
        err=>this.error = err
      )
    } else {
      this.product = this.productService.getProduct(this.id);
    }
  }

  addToOrder(product:Product){
    let dummy = _.cloneDeep(product)
    dummy.quantity = 1;
    if(this.productService.removeQuantity(dummy)){
      this.orderService.addToOrder(dummy)
    } else {
      alert('out of stock !')
    }
  }

  buyNow(product:Product){
    let dummy = _.cloneDeep(product)
    dummy.quantity = 1;
    if(this.productService.removeQuantity(dummy)){
      this.orderService.addToOrder(dummy)
    } else {
      alert('out of stock !')
    }
  }

}
