import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-description-timeframe',
  templateUrl: './description-timeframe.component.html',
  styleUrls: ['./description-timeframe.component.scss']
})
export class DescriptionTimeframeComponent implements OnInit {

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
