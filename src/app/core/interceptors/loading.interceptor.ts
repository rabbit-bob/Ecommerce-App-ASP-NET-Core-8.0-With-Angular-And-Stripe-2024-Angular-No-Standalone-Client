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
  const skipUrls: { url: string; method?: string }[] = [
    // { url: '/api/account/login', method: 'POST' },
    // { url: '/api/account/register', method: 'POST' },
    { url: '/api/Accounts/check-email-exist' },
    { url: '/api/Orders/create-order', method: 'POST' },
  ];

  // Check if the request URL and method should be excluded from the loading indicator
  if (
    !skipUrls.some(
      (skip) => req.url.includes(skip.url) && (!skip.method || req.method === skip.method)
    )
  ) {
    loadingService.startLoading();
  }

  return next(req).pipe(
    // Ensure the loading indicator is stopped once the request completes
    finalize(() => loadingService.stopLoading())
  );
};
