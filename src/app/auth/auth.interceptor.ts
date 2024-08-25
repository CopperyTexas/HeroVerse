import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;
  if (!token) return next(req);
  if (isRefreshing$.value) {
    return refreshAndProcced(authService, req, next);
  }
  return next(addToken(req, token)).pipe(
    catchError((error) => {
      if (error.status === 403) {
        return refreshAndProcced(authService, req, next);
      }
      return throwError(error);
    })
  );
};
const refreshAndProcced = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);
    return authService.refreshAuthToken().pipe(
      switchMap((res) => {
        return next(addToken(req, res.accessToken)).pipe(
          tap(() => {
            isRefreshing$.next(false);
          })
        );
      }),
      catchError((error) => {
        isRefreshing$.next(false);
        authService.logout();
        return throwError(error);
      })
    );
  }
  if (req.url.includes('refresh'))
    return next(addToken(req, authService.token!));
  return isRefreshing$.pipe(
    filter((isRefreshing$) => !isRefreshing$),
    switchMap((res) => {
      return next(addToken(req, authService.token!));
    })
  );
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
