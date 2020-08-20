import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/service/order.service';
import { Product } from 'src/app/service/product.service';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {

  constructor(
    private route:ActivatedRoute,
    private httpService:HttpService,
  ) { }

  order:Order = new Order();
  id:string;
  err:any;

  ngOnInit(): void {
    this.route.params.subscribe(
      (param)=>{
        this.id = param.id
        this.loadOrder()
      }
    )
  }

  totalPrice(){
    let total = 0;
    this.order.items.forEach((item)=>{
      total = total + (item.cost * item.quantity)
    })
    return total;
  }

  loadOrder(){
    this.httpService.getOrderById(this.id).subscribe(
      (order:Order)=>this.order = order,
      err=>this.err = err
    )
  }
}
