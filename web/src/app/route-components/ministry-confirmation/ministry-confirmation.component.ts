import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { Observable } from "rxjs";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./ministry-confirmation.component.html",
  styleUrls: ["./ministry-confirmation.component.scss"],
})
export class MinistryConfirmationComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;

  foiRequest: FoiRequest;
  ministries$: Observable<any>;
  ministries: Array<any>;
  defaultMinistry: any;
  targetKey: string = "ministry";
  feeAmount: number = 0;
  requiresPayment: boolean = null;
  isforestministry: boolean = false;
  hideforestministryongoingwildfirealert: boolean = true;
  isEAOministry: boolean = false;
  isENVministry: boolean = false;
  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.defaultMinistry = this.foiRequest.requestData[this.targetKey].defaultMinistry;
    let selectedMinistry = this.foiRequest.requestData[this.targetKey].selectedMinistry;
    this.requiresPayment = this.foiRequest.requestData.requestType.requestType === "general";

    // Fetch Ministries from the data service.
    this.ministries$ = this.dataService.getMinistries().pipe(
      map((ministries) => {
        ministries.forEach((m) => {
          m.selected = m.defaulted = this.defaultMinistry && m.code === this.defaultMinistry.code;
          m.selected = m.selected || (selectedMinistry ? !!selectedMinistry.find((ms) => ms.code === m.code) : false);
          if (m.code === "EAO" && m.selected === true) {
            this.isEAOministry = true;
          } else if (m.code === "EAO" && m.selected === false) {
            this.isEAOministry = false;
          }
          if (m.code === "ENV" && m.selected === true) {
            this.isENVministry = true;
          } else if (m.code === "ENV" && m.selected === false) {
            this.isENVministry = false;
          }

          if (m.code === "FOR" && m.selected === true) {
            this.isforestministry = true;
          } else if (m.code === "FOR" && m.selected === false) {
            this.isforestministry = false;
          }
        });
        return ministries;
      }),
      map((ministries) => {
        this.base.continueDisabled = !ministries.find((m) => m.selected);

        const feeQuantity = this.dataService.calculateUnitFeeQuantity({
          selectedMinistry: ministries.filter((m) => m.selected),
        });
        this.feeAmount = feeQuantity.valueOf() * 10;

        return ministries;
      }),
      map((ministries) => {
        this.ministries = ministries;
        return ministries;
      })
    );
  }

  selectMinistry(m: any) {
    m.selected = !m.selected;
    if (m.code === "EAO" && m.selected === true) {
      this.isEAOministry = true;
    } else if (m.code === "EAO" && m.selected === false) {
      this.isEAOministry = false;
    }
    if (m.code === "ENV" && m.selected === true) {
      this.isENVministry = true;
    } else if (m.code === "ENV" && m.selected === false) {
      this.isENVministry = false;
    }
    if (m.code === "FOR" && m.selected === true) {
      this.isforestministry = true;
    } else if (m.code === "FOR" && m.selected === false) {
      this.isforestministry = false;
    }
    this.setContinueDisabled();
  }

  setContinueDisabled() {
    let selected = this.ministries.filter((m) => m.selected);

    if (selected.length == 0) {
      this.base.continueDisabled = true;
      this.feeAmount = 0;
    } else {
      this.base.continueDisabled = false;
      const feeQuantity = this.dataService.calculateUnitFeeQuantity({
        selectedMinistry: selected,
      });
      this.feeAmount = feeQuantity.valueOf() * 10;
    }
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
    let selected = this.ministries.filter((m) => m.selected);

    this.foiRequest.requestData[this.targetKey].selectedMinistry = selected;
    this.foiRequest.requestData[this.targetKey].ministryPage = this.base.getCurrentRoute();
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);

    this.forwardforSelectedPersonalTopics();
  }

  forwardforSelectedPersonalTopics() {
    if (
      this.foiRequest.requestData.selectedtopics != undefined &&
      this.foiRequest.requestData.selectedtopics.length > 0 &&
      this.foiRequest.requestData.requestType === "personal"
    ) {
      let current = this.foiRequest.requestData.selectedtopics.find((st) => st.value === this.targetKey);
      let ci = this.foiRequest.requestData.selectedtopics.indexOf(current);
      let next = this.foiRequest.requestData.selectedtopics[ci + 1];
      if (next != undefined) {
        this.route.navigate([`/personal/${next.value}`]);
      } else {
        this.base.goFoiForward();
      }
    } else {
      this.base.goFoiForward();
    }
  }

  doGoBack() {
    //console.log(`Topic  ${this.foiRequest.requestData.requestTopic.value}`)
    this.base.goFoiBack();
  }
}
