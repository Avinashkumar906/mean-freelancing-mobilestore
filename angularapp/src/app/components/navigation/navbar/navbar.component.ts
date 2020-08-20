import { Component, OnInit } from '@angular/core';
import { User, UserService } from 'src/app/service/user.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user:User = this.userService.getUser()

  constructor(
    private userService:UserService,
    private orderService:OrderService,
  ) { }

  ngOnInit(): void {
    this.userService.userChanged.subscribe(
      (user:User)=>this.user=user,
    )
  }

  logout(){
    this.userService.logout()
  }

  getCount(){
    return this.orderService.getCount()
  }
  // isLogged(){
  //   return this.userService.
  // }
}
