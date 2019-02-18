import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  templateUrl: './verify-your-identity.component.html',
  styleUrls: ['./verify-your-identity.component.scss']
})
export class VerifyYourIdentityComponent implements OnInit {

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

