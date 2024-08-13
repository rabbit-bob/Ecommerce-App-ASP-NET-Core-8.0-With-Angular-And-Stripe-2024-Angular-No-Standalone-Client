import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loaderRequestCount: number = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  loader() {
    this.loaderRequestCount++;
    this.spinnerService.show(undefined, {
      type: "ball-spin-fade",
      color: "#e30808",
      bdColor: "rgba(0,0,0,0.6)",
      size: "medium"
    });
  }

  hidingLoader() {
    this.loaderRequestCount--;
    if (this.loaderRequestCount <= 0) {
      this.loaderRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
