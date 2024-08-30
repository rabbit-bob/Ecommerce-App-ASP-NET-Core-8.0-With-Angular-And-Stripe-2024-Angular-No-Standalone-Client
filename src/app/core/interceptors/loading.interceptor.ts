import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * HTTP Interceptor to manage loading indicators for HTTP requests.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private skipUrls: string[] = ['/api/account/login', '/api/account/register']; // URLs to exclude from showing the loading indicator

  /**
   * Injects LoadingService to control loading indicators.
   */
  constructor(private loadingService: LoadingService) {}

  /**
   * Intercepts HTTP requests to manage loading indicators.
   * @param req The outgoing HTTP request.
   * @param next The next interceptor in the chain.
   * @returns An observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request URL should be excluded from loading indicator
    if (!this.skipUrls.some((url) => req.url.includes(url))) {
      this.loadingService.startLoading();
    }

    return next.handle(req).pipe(
      finalize(() => this.loadingService.stopLoading()) // Ensure the loading indicator is stopped once the request completes
    );
  }
}
