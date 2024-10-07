import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { UserDetail } from 'src/app/profile/profile/profile.component';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged: BehaviorSubject<boolean> = new BehaviorSubject(this.getToken())
  authStatus = this.isLogged.asObservable();

  private authUrl = environment.authUrl;
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  changeAuthStatus(value: boolean) {
    this.isLogged.next(value);
  }

  // Registration auth call
  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/auth/register`, userData, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Login auth call
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/auth/login`, credentials, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getToken() {
    const token = sessionStorage.getItem('_t');
    if (token) {
      return true;
    }
    return false;
  }


  setTokens(accessToken: string, refreshToken: string) {
    sessionStorage.setItem('_t', accessToken);
    sessionStorage.setItem('_rt', refreshToken);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('_t');
  }

  // Get the refresh token
  getRefreshToken(): string | null {
    return sessionStorage.getItem('_rt');
  }

  // Check if the access token is expired
  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = decodedToken.exp * 1000; // exp is in seconds, so convert to milliseconds
    return expirationDate < Date.now();
  }

  // Request a new access token using the refresh token
  requestNewAccessToken(refreshToken: string): Observable<any> {
    const payload = { refreshToken };
    return this.http.post(`${this.authUrl}/auth/refresh-token`, payload);
  }

  clearTokens() {
    sessionStorage.removeItem('_t');
    sessionStorage.removeItem('_rt');
  }


  getUserDetail() {
    const token = this.getAccessToken();
    var decodeToken: any;
    if (token) {
      decodeToken = jwtDecode(token);
    }
   return this.http.get<UserDetail>(`${this.authUrl}/auth/user-detail/${decodeToken.id}`);
  }

  updateUser(user:UserDetail){
    return this.http.put(`${this.authUrl}/auth/update-user-detail/${user.id}`,user)
  }
}