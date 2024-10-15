import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  sideNavCollapsed: boolean = true;
  isLogged!: boolean;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe({
      next: (res) => {
        this.isLogged = res;
        this.sideNavCollapsed = res;
      }
    })
  }

  toggleSideNav() {
    return this.sideNavCollapsed = !this.sideNavCollapsed;
  }

}
