import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss']
})
export class DeliveryOptionsComponent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  constructor() {}

  ngOnInit() {
  }

  doContinue() {
    this.base.goFoiForward();
  }
  doGoBack() {
    this.base.goFoiBack();
  }

}
