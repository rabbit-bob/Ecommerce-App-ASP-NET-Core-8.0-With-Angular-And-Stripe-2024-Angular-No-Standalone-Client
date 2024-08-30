import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

/**
 * HTTP Interceptor function to manage loading indicators for HTTP requests.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject LoadingService to control loading indicators
  const loadingService = inject(LoadingService);
  
  // URLs to exclude from showing the loading indicator
  const skipUrls: string[] = [
    // '/api/account/login', 
    // '/api/account/register',
    '/api/account/check-email-exist'
  ];

  // Check if the request URL should be excluded from the loading indicator
  if (!skipUrls.some((url) => req.url.includes(url))) {
    loadingService.startLoading();
  }

  return next(req).pipe(
    // Ensure the loading indicator is stopped once the request completes
    finalize(() => loadingService.stopLoading())
  );
};
