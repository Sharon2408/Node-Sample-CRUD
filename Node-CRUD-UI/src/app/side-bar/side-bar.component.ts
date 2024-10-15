import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  userDetail: UserDetail | null = {
    id: 0,
    name: '',
    email: '',
    profile_image: '',
    isAdmin: 0
  };
  apiUrl = environment.authUrl;

  constructor(public authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.authStatus();
    this.updateUserData();
  }

  authStatus() {
    this.authService.authStatus$.subscribe({
      next: (loggedIn: boolean) => {
        this.isLogged = loggedIn;
        if (loggedIn) {
          this.getUserDetail();
        }
      }
    });
  }


  getUserDetail() {
    this.authService.getUserDetail().subscribe({
      next: (res: UserDetail) => {
        this.userDetail = res;
        sessionStorage.setItem("role", this.userDetail.isAdmin.toString())
        this.cdr.markForCheck();
      }
    });
  }

  updateUserData() {
    this.authService.user$.subscribe({
      next: (userStatus: boolean) => {
        if (userStatus) {
          this.getUserDetail();

        }
      }
    });
  }

  logout() {
    this.authService.clearTokens();
    this.authService.changeAuthStatus(false);
    this.router.navigateByUrl('/auth/login');
  }

}
