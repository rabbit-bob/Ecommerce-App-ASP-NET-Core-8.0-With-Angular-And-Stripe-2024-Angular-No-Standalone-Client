import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err) {
        if (err.status === 404) {
          //
        }
        if (err.status === 500) {
          //
        }
      }
      return throwError(() => new Error(err.message || 'Server Not Found!'));
    })
  );
};
