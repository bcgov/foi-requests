import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  templateUrl: './child-information.component.html',
  styleUrls: ['./child-information.component.scss']
})
export class ChildInformationComponent implements OnInit {

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
