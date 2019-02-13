import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';


@Component({
  selector: 'app-getting-started2',
  templateUrl: './getting-started2.component.html',
  styleUrls: ['./getting-started2.component.scss']
})
export class GettingStarted2Component implements OnInit {
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
