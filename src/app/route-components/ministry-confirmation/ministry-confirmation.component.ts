import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { Observable } from "rxjs";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { map } from "rxjs/operators";

@Component({
  templateUrl: "./ministry-confirmation.component.html",
  styleUrls: ["./ministry-confirmation.component.scss"]
})
export class MinistryConfirmationComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;

  foiRequest: FoiRequest;
  ministries$: Observable<any>;
  ministries: Array<any>;
  defaultMinistry: any;
  targetKey: string = "ministry";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.defaultMinistry = this.foiRequest.requestData[this.targetKey].default;
    let selectedMinistry = this.foiRequest.requestData[this.targetKey].selectedMinistry;

    // Fetch Ministries from the data service.
    this.ministries$ = this.dataService.getMinistries().pipe(
      map(ministries => {
        ministries.forEach(m => {
          m.selected = m.defaulted = this.defaultMinistry && (m.code === this.defaultMinistry.code);
          m.selected = m.selected || (selectedMinistry ? !!selectedMinistry.find(ms => ms.code === m.code) : false);
        });
        return ministries;
      }),
      map(ministries => {
        this.base.continueDisabled = !ministries.find(m => m.selected);
        return ministries;
      }),
      map(ministries => {
        this.ministries = ministries;
        return ministries;
      })
    );
  }

  selectMinistry(m: any) {
    m.selected = !m.selected;
    this.setContinueDisabled();
  }

  setContinueDisabled() {
    let selected = this.ministries.filter(m => m.selected);
    this.base.continueDisabled = selected.length == 0;
  }

  ministryListClasses(m: any): string {
    let ret: string = "";
    if (m.defaulted) {
      ret += "defaultMinistry";
    }

    return ret;
  }

  doContinue() {
    // Copy out submitted form data.
    let selected = this.ministries.filter(m => m.selected);

    this.foiRequest.requestData[this.targetKey].selectedMinistry = selected;
    this.foiRequest.requestData[this.targetKey].ministryPage = this.base.getCurrentRoute();
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
