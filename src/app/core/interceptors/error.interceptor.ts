import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err) {
        if (err.status === 404) {
          //
          router.navigateByUrl('/not-found');
        }
        if (err.status === 500) {
          //
          router.navigateByUrl('/server-error');
        }
      }
      return throwError(() => new Error(err.message || 'Server Not Found!'));
    })
  );
};
