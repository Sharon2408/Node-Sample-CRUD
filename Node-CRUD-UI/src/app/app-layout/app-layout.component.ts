import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {
  sideNavCollapsed: boolean = true;
  sideNav:boolean = false;
  isLogged!: boolean;

  constructor(public authService: AuthService, private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe({
      next: (res) => {
        this.isLogged = res;
        this.sideNavCollapsed = res;
      }
    })
  }

  toggleSideNav() {
    console.log(this.sideNavCollapsed);
    return this.sideNavCollapsed = !this.sideNavCollapsed;
  }

  toggleSideNavMobile() {
    return this.sideNav = !this.sideNav;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const maxWidth = 992;
    this.sideNavCollapsed = window.innerWidth >= maxWidth;
  }
}


