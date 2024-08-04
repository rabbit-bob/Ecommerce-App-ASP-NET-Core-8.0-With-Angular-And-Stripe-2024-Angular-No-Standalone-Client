import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  baseURL = "";
  products: any[] = [];

  constructor(private http: HttpClient) {}
  
  getProduct() {
    return this.http.get(this.baseURL).subscribe(
      (values: any) => {
        this.products = values;
      }
    );
  }

  ngOnInit(): void {
    this.getProduct();
  }
}
