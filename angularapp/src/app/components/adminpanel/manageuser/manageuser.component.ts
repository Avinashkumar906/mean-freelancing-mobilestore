import { Component, OnInit } from '@angular/core';
import { User, UserService } from 'src/app/service/user.service';
import { HttpService } from 'src/app/service/http.service';
import * as _ from 'lodash'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.scss']
})
export class ManageuserComponent implements OnInit {

  constructor(
    private userService :UserService,
    private httpService:HttpService
  ) { }

  userList:Array<User>;
  env = environment;
  key:string= '';

  ngOnInit(): void {
    this.fetchUsers()
  }

  fetchUsers(){
    this.httpService.getUsers().subscribe(
      (users:Array<User>)=>{
        this.userList = _.filter(users,(user)=>user.email !== this.env.admin);
      },
      err=>console.log(err)
    )
  }

  switchRole(user:User){
    let selection = confirm('Want to change role?')
    if(selection){
      this.httpService.switchRole(user).subscribe(
        (user:User)=>this.fetchUsers(),
        err=>console.log(err)
      )
    }
  }

  delete(user:User){
    let selection = confirm('Sure want to delete?')
    if(selection){
      this.httpService.deleteUser(user).subscribe(
        (user:User)=>this.fetchUsers(),
        err=>console.log(err)
      )
    }
  }

  filter(key:string){
    this.key = key;
  }
}
