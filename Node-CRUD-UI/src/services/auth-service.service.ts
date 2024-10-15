import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { UserDetail } from 'src/app/profile/profile/profile.component';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged: BehaviorSubject<boolean> = new BehaviorSubject(this.getToken());
  userSubject = new BehaviorSubject<boolean>(false);

  user$ = this.userSubject.asObservable();
  authStatus$ = this.isLogged.asObservable();



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
    })
      .pipe(
        tap(() => {
          this.userSubject.next(true); // Emit updated user detail
        })
      );
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
    const decodedToken: any = this.decodeToken(token);
    const expirationDate = decodedToken.exp * 1000; // exp is in seconds, so convert to milliseconds
    return expirationDate < Date.now();
  }

  decodeToken(token: string | null): any {
    try {
      if (token)
        return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  // Request a new access token using the refresh token
  requestNewAccessToken(refreshToken: string): Observable<any> {
    const payload = { refreshToken };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.authUrl}/auth/refresh-token`, payload, { headers });
  }

  clearTokens() {
    sessionStorage.removeItem('_t');
    sessionStorage.removeItem('_rt');
  }


  getUserDetail(): Observable<UserDetail> {
    const token = this.getAccessToken();
    var decodeToken: any;
    if (token) {
      decodeToken = jwtDecode(token);
    }
    return this.http.get<UserDetail>(`${this.authUrl}/auth/user-detail/${decodeToken.id}`);
  }



  updateUser(user: UserDetail): Observable<any> {
    return this.http.put(`${this.authUrl}/auth/update-user-detail/${user.id}`, user)
      .pipe(
        tap(() => {
          this.userSubject.next(true); // Emit updated user detail
        })
      );
  }

  uploadFile(file: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file, file.name);
    return this.http.post(`${this.authUrl}/auth/upload-profile/${id}`, formData);
  }


  getRole(): string | null {
    const role = sessionStorage.getItem("role");
    return role;
  }
}