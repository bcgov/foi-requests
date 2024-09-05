import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";

@Component({
  selector: "app-general-info",
  templateUrl: "./general-info.component.html",
  styleUrls: ["./general-info.component.scss"],
})
export class GeneralInfoComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;

  constructor() {}

  ngOnInit() {}

  doContinue() {
    this.base.goFoiForward();
  }
  doGoBack() {
    this.base.goFoiBack();
  }
}
