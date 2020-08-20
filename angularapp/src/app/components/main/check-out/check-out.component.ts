import { Component, OnInit } from '@angular/core';
import { User, UserService } from 'src/app/service/user.service';
import * as _ from 'lodash'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderService, Order } from 'src/app/service/order.service';
import { Product, ProductService } from 'src/app/service/product.service';
import { HttpService } from 'src/app/service/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  constructor(
    private userService:UserService,
    private formbuilder:FormBuilder,
    private orderService:OrderService,
    private productService:ProductService,
    private httpService:HttpService,
    private router :Router
  ) { 
    this.userForm = this.formbuilder.group({
      name:['',[Validators.required,Validators.minLength(4)]],
      email:['',[Validators.required,Validators.email]],
      address:['',[Validators.required]]
    })
  }
  
  user:User = _.cloneDeep(this.userService.getUser());
  order:Order = this.orderService.getOrder();
  userForm:FormGroup;
  submitted:boolean = false;

  ngOnInit(): void {
    this.user ? this.userForm.patchValue(this.user) : '';
    this.userService.userChanged.subscribe(
      (user:User)=>{
        user ? this.userForm.patchValue(user) : '';
        this.user = user;
      },
      err=>console.log(err)
    )
    this.orderService.orderChanged.subscribe(
      (order:Order)=>this.order = order,
      err=>console.log(err)
    )
  }
  addMore(item:Product){
    let dummy = _.cloneDeep(item)
    dummy.quantity = 1;
    if(this.productService.removeQuantity(dummy)){
      this.orderService.addToOrder(dummy)
    } else {
      alert('out of stock !')
    }
  }

  remove(item:Product){
    let dummy = _.cloneDeep(item)
    dummy.quantity = 1;
    this.orderService.removeFromOrder(dummy)
    this.productService.addQuantity(dummy)
  }

  getTotal(){
    let total = 0;
    this.order.items.forEach((item)=>{
      total = total + (item.quantity * item.cost)
    })
    return total
  }

  get userFormControl(){
    return this.userForm.controls;
  }

  checkOut(){
    this.submitted = true;
    this.order.name =this.userForm.value.name;
    this.order.email =this.userForm.value.email
    this.order.address =this.userForm.value.address
    this.httpService.placeOrder(this.order).subscribe(
      (order:Order)=>{
        this.orderService.clearCart();
        this.router.navigate(['orderdetail',order._id])
      },
      err=>{
        console.log(err);
        this.submitted = false;
      }
    )
  }
}
