import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { delay, finalize } from 'rxjs';
import { inject } from '@angular/core';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  loaderService.loader();
  return next(req).pipe(
    delay(1000),
    finalize(() => {
      loaderService.hidingLoader();
    })
  );
};
