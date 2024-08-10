import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastrService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err) {
        if (err.status === 400) {
          if (err.error.errors) {
            throw err.error;
          } else {
            toast.error(err.error.message, err.status.toString());
          }
        }
        if (err.status === 401) {
          toast.error(err.error.message, err.status.toString());
        }
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
