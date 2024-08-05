import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../shared/Models/IProduct';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss'
})
export class ShopItemComponent implements OnInit {
  @Input() product: IProduct | undefined;

  constructor() { }

  ngOnInit(): void {

  }

}
