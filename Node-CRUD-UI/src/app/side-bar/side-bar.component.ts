import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  isLogged!: boolean;
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.authStatus.subscribe({
      next: (res) => {
        this.isLogged = res;
      }
    })
  }

  logout() {
    this.authService.clearTokens();
    this.authService.changeAuthStatus(false);
    this.router.navigateByUrl('/auth/login')
  }
}
