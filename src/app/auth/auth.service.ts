import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenResponse } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApiUrl = environment.apiUrl;
  cookieService = inject(CookieService);
  router = inject(Router);
  token: string | null = null;
  refreshToken: string | null = null;
  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.token;
  }

  constructor(private http: HttpClient) {}
  login(credentials: {
    username: string;
    password: string;
  }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}/login`, credentials)
      .pipe(tap((value) => this.saveTokens(value)));
  }
  refreshAuthToken() {
    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}/refresh-token`, {
        refreshToken: this.refreshToken,
      })
      .pipe(
        tap((value) => this.saveTokens(value)),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }

  logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login']);
  }
  saveTokens(res: TokenResponse) {
    this.token = res.accessToken;
    this.refreshToken = res.refreshToken;
    this.cookieService.set('token', this.token);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}
