import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userDetail: UserDetail = {
    id:0,
    name:'',
    email:''
  };

  constructor(public authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.authService.getUserDetail().subscribe({
      next: (res) => {
        this.userDetail = res;
      }
    });
  }

}


export interface UserDetail{
  id:number;
  name:string;
  email:string;
}