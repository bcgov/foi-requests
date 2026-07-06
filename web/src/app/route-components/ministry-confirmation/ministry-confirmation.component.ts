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
  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router) { }

  readonly personalTopicMinistryCodeMap: { [key: string]: string } = {
    publicServiceEmployment: "PSA",
    correctionalFacility: "PSSG",
    incomeAssistance: "MSD",
    adoption: "MCF",
    childprotectionchild: "MCF",
    childprotectionparent: "MCF",
    fosterparent: "MCF",
    youthincarechild: "MCF",
    youthincareparent: "MCF",
  };

  readonly otherPersonalTopicValue: string = "anotherTopic";

  isPersonalRequest: boolean = false;
  isLockedPersonalMinistryRequest: boolean = false;
  isOtherPersonalRequest: boolean = false;
  lockedPersonalMinistryCode: string = null;

  private getRequestType(): string {
    const requestType = this.foiRequest?.requestData?.requestType;
    return requestType?.requestType || requestType;
  }

  private getCurrentRequestTopicValue(): string {
    const currentRequestTopic = this.foiRequest?.requestData?.requestTopic?.value;

    if (currentRequestTopic) {
      return currentRequestTopic;
    }

    const currentUrl = this.route.url || "";
    const personalRouteMatch = currentUrl.match(/\/personal\/([^\/]+)\/ministry-confirmation/);

    return personalRouteMatch ? personalRouteMatch[1] : null;
  }

  private applyPersonalMinistryRules(ministries: any[]): any[] {
    if (this.isLockedPersonalMinistryRequest) {
      ministries.forEach((m) => {
        const isLockedMinistry = m.code === this.lockedPersonalMinistryCode;
        m.selected = isLockedMinistry;
        m.defaulted = isLockedMinistry;
        m.disabled = true;
      });

      return ministries;
    }

    if (this.isOtherPersonalRequest) {
      return this.applyOtherPersonalMinistryRules(ministries);
    }

    ministries.forEach((m) => {
      m.disabled = false;
    });

    return ministries;
  }

  private applyOtherPersonalMinistryRules(ministries: any[]): any[] {
    const selectedMinistries = ministries.filter((m) => m.selected);

    if (selectedMinistries.length > 1) {
      const selectedMinistry = selectedMinistries[0];

      ministries.forEach((m) => {
        m.selected = m.code === selectedMinistry.code;
      });
    }

    const hasSelectedMinistry = ministries.some((m) => m.selected);

    ministries.forEach((m) => {
      m.defaulted = false;
      m.disabled = hasSelectedMinistry && !m.selected;
    });

    return ministries;
  }

  private refreshSelectedMinistryFlags(ministries: any[]): void {
    this.isEAOministry = !!ministries.find((m) => m.code === "EAO" && m.selected);
    this.isENVministry = !!ministries.find((m) => m.code === "ENV" && m.selected);
    this.isforestministry = !!ministries.find((m) => m.code === "FOR" && m.selected);
  }



  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.defaultMinistry = this.foiRequest.requestData[this.targetKey].defaultMinistry;
    let selectedMinistry = this.foiRequest.requestData[this.targetKey].selectedMinistry;
    this.requiresPayment = this.foiRequest.requestData.requestType.requestType === "general";
    const currentRequestTopicValue = this.getCurrentRequestTopicValue();

    this.isPersonalRequest = this.getRequestType() === "personal" || this.route.url.includes("/personal/");
    this.lockedPersonalMinistryCode = this.isPersonalRequest
      ? this.personalTopicMinistryCodeMap[currentRequestTopicValue]
      : null;
    this.isLockedPersonalMinistryRequest = !!this.lockedPersonalMinistryCode;
    this.isOtherPersonalRequest = this.isPersonalRequest && currentRequestTopicValue === this.otherPersonalTopicValue;

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

        ministries = this.applyPersonalMinistryRules(ministries);
        this.refreshSelectedMinistryFlags(ministries);

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
    if (this.isLockedPersonalMinistryRequest) {
      return;
    }

    m.selected = !m.selected;

    if (this.isOtherPersonalRequest) {
      this.applyOtherPersonalMinistryRules(this.ministries);
    }

    this.refreshSelectedMinistryFlags(this.ministries);
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
