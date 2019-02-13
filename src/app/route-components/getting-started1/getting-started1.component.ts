import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { DataService } from 'src/app/services/data.service';
import { FoiRequest } from 'src/app/models/FoiRequest';

@Component({
  selector: 'app-getting-started1',
  templateUrl: './getting-started1.component.html',
  styleUrls: ['./getting-started1.component.scss']
})
export class GettingStarted1Component implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;

  foiRequest: FoiRequest;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
  }

  doContinue() {
    this.foiRequest.requestData.gettingStarted1 = 'Started on ' + new Date().toDateString();
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }
  doGoBack() {
    this.base.goFoiBack();
  }
}
