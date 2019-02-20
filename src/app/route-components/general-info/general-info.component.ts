import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;

  foiRequest: FoiRequest;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
  }

  doContinue() {
    this.foiRequest.requestData.ministry = this.foiRequest.requestData.ministry || {};
    this.foiRequest.requestData.ministry.default = { code: null }; // No default!
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }
  doGoBack() {
    this.base.goFoiBack();
  }
}
