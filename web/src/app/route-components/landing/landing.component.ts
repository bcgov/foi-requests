import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;

  showPanel: boolean = false;
  foiRequest: FoiRequest;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
  }

  doContinue() {
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }

  showInformationCollectPanel() {
    this.showPanel = true;
  }

  hideInformationCollectPanel() {
    this.showPanel = false;
  }
}
