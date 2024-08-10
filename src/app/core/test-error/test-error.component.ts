import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent implements OnInit {

  baseURL: string = environment.baseURL;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  onGet500Error() {
    this.http.get(this.baseURL + 'ErrorLogs/server-error').subscribe({
      next: (next) => console.info(next),
      error: (err) => console.error(err)
    });
  }

  onGet404Error() {
    this.http.get(this.baseURL + 'Products/973').subscribe({
      next: (next) => console.info(next),
      error: (err) => console.error(err)
    });
  }

  onGet400Error() {
    this.http.get(this.baseURL + 'ErrorLogs/bad-request').subscribe({
      next: (next) => console.info(next),
      error: (err) => console.error(err)
    });
  }
  
  onGet400ValidationError() {
    this.http.get(this.baseURL + 'ErrorLogs/bad-request/three').subscribe({
      next: (next) => console.info(next),
      error: (err) => console.error(err)
    });
  }
}
