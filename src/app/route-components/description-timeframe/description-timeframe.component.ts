import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  templateUrl: './description-timeframe.component.html',
  styleUrls: ['./description-timeframe.component.scss']
})
export class DescriptionTimeframeComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  showRequestTopic: Boolean;

  constructor() {}

  ngOnInit() {
      this.base.getFoiRouteData().subscribe(data => {
        if (data) {
          this.showRequestTopic = data.showRequestTopic || false;
        }
      });
  }

  doContinue() {
    this.base.goFoiForward();
  }
  doGoBack() {
    this.base.goFoiBack();
  }
}
