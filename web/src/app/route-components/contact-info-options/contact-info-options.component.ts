import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { KeycloakService } from "../../services/keycloak.service";
import { MatDialog } from "@angular/material/dialog";
import { DelayWarningDialog } from "./delay-warning-dialog.component";

@Component({
  templateUrl: "./contact-info-options.component.html",
  styleUrls: ["./contact-info-options.component.scss"],
})
export class ContactInfoOptionsComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;
  foiForm: FormGroup;
  foiRequest: FoiRequest;
  targetKey: string = "contactInfoOptions";
  isAuthenticated: boolean = false;
  tip = "";
  hasmcfdspecificrecordsrequests: boolean = false;
  // readonly dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private keycloak: KeycloakService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // Update email if the user is authenticated
    const token = this.keycloak.getDecodedToken();
    this.isAuthenticated = token !== undefined && token.sub !== undefined;

    this.foiForm = this.fb.group({
      phonePrimary: [null, [Validators.minLength(10), Validators.maxLength(25)]],
      phoneSecondary: [null, [Validators.minLength(10), Validators.maxLength(25)]],
      email: [
        { value: token.email, disabled: this.isAuthenticated },
        // Regex: (non-whitespace) + '@' + (non-whitespace) + '.' + (non-whitespace)
        [Validators.maxLength(255), Validators.pattern(/\S+@\S+\.\S/)],
      ],
      address: [null, [Validators.maxLength(255)]],
      city: [null, [Validators.maxLength(255)]],
      postal: [null, [Validators.maxLength(255)]],
      province: [null, [Validators.maxLength(255)]],
      country: [null, [Validators.maxLength(255)]],
    });
    this.tip = this.isAuthenticated ? "" : "Email address is required for electronic delivery";
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    if (this.isAuthenticated) {
      this.foiRequest.requestData.contactInfoOptions.email = token.email;
    }
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey], { emitEvent: true });
    this.hasmcfdspecificrecordsrequests =
      this.foiRequest.requestData.selectedtopics != undefined && this.foiRequest.requestData.selectedtopics.length > 0;

    if (this.hasmcfdspecificrecordsrequests) {
      setTimeout(() => {
        this.openDialog();
      }, 500);
    }
  }

  /**
   * Used to disable the Continue button.
   */
  allowContinue() {
    const formData = this.foiForm.value;
    let result = false;
    if (formData.email || this.keycloak.getDecodedToken().email) {
      result = true;
    }
    if (formData.phonePrimary) {
      result = true;
    }
    if (formData.phoneSecondary) {
      result = true;
    }
    if (formData.address && formData.city && formData.postal && formData.province && formData.country) {
      result = true;
    }
    return result;
  }

  doContinue() {
    // Update save data & proceed.
    this.foiForm.controls.email.enable();
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward();
  }

  doGoBack() {
    const requestIspersonal = this.foiRequest.requestData.requestType.requestType === "personal";
    const isAdoption = this.foiRequest.requestData.requestTopic.value === "adoption";
    const personalNonAdoption = requestIspersonal && !isAdoption;
    if (personalNonAdoption) {
      // Personal non-Adoption can skip over the previous route, 'adoptive-parents'.
      this.base.goSkipBack();
      return;
    }
    this.base.goFoiBack();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DelayWarningDialog);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
