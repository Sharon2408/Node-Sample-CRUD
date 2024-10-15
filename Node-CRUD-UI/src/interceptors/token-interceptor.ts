import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap} from 'rxjs/operators';
import { AuthService } from 'src/services/auth-service.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService,private router:Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

//console.log(request);

    // Clone the request to add the authorization header

    let authReq = request;
    if (accessToken && !this.authService.isTokenExpired(accessToken)) {
      authReq = this.addTokenToRequest(request, accessToken);
    }

    // Handle the request
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the error is 401 Unauthorized, attempt to refresh the token
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(request, next);
        }

        return throwError(error);
      })
    );
  }

  // Add the access token to the Authorization header
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle 401 error by attempting to refresh the access token
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = this.authService.getRefreshToken();
   
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    return this.authService.requestNewAccessToken(refreshToken).pipe(
      switchMap((response: any) => {
        this.isRefreshing = false;
        this.authService.setTokens(response.accessToken,refreshToken); // Save new tokens
        this.refreshTokenSubject.next(response.accessToken);
        return next.handle(this.addTokenToRequest(request, response.accessToken));
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.authService.clearTokens();
        this.authService.changeAuthStatus(false);
        this.router.navigateByUrl('/auth/login');
        return throwError(err);
      })
    );
  }
}
