import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service.service';
import { UserDetail } from '../profile/profile/profile.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isLogged!: boolean;
  userDetail: UserDetail = {
    id: 0,
    name: '',
    email: '',
    profile_image: ''
  };
  apiUrl = environment.authUrl;
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authStatus();
    this.getUserDetail();
  }

  authStatus() {
    this.authService.authStatus.subscribe({
      next: (res) => {
        this.isLogged = res;
      }
    })
  }

  getUserDetail() {
    this.authService.getUserDetail().subscribe({
      next: (res) => {
        this.userDetail = res;
      }
    });
  }

  logout() {
    this.authService.clearTokens();
    this.authService.changeAuthStatus(false);
    this.router.navigateByUrl('/auth/login')
  }
}
