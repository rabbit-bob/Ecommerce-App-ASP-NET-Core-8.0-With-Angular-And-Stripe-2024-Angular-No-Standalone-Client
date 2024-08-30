import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for managing the loading state across the application.
 */
@Injectable({
  providedIn: 'root' // Makes the service available at the root level of the application
})
export class LoadingService {
  // BehaviorSubject to store the loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // Observable to expose the loading state to components that subscribe to changes
  loading$ = this.loadingSubject.asObservable();

  constructor() { }

  /**
   * Starts the loading state.
   * This method sets the loading state to true, indicating that a loading process has started.
   */
  startLoading() {
    this.loadingSubject.next(true);
  }

  /**
   * Stops the loading state.
   * This method sets the loading state to false, indicating that a loading process has ended.
   */
  stopLoading() {
    this.loadingSubject.next(false);
  }
}
