import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  showPanel: boolean = false;

  foiRequest: FoiRequest;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
  }
  
  doContinue() {
    this.foiRequest.requestData.landed="landed";
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }
  doGoBack() {
    this.base.goFoiBack();
  }

  showInformationCollectPanel(){
    console.log("Going to show the panel");
    this.showPanel = true;
  }


}
