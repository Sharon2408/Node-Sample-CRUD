import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],

})
export class NavbarComponent implements OnInit {

  isLogged!: boolean;

  @Output() toggleSideNav: EventEmitter<void> = new EventEmitter();
  @Input() hamIcon!:boolean;
  
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.authStatus$.subscribe({
      next: (res) => {
        this.isLogged = res;
      }
    })
  }
  onToggleSideNav() {
    this.toggleSideNav.emit();
  }

  logout() {
    this.authService.clearTokens();
    this.authService.changeAuthStatus(false);
    this.router.navigateByUrl('/auth/login')
  }
}
