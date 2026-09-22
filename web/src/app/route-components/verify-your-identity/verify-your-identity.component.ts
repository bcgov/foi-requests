import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { FoiRequest } from "src/app/models/FoiRequest";
import { DataService } from "src/app/services/data.service";
import { KeycloakService } from "../../services/keycloak.service";
import {
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeFormats
} from "@danielmoncada/angular-datetime-picker";

const BIRTH_DATE_FORMATS: OwlDateTimeFormats = {
  parseInput: null,
  fullPickerInput: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric"
  },
  datePickerInput: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  },
  timePickerInput: {
    hour: "numeric",
    minute: "numeric"
  },
  monthYearLabel: {
    year: "numeric",
    month: "short"
  },
  dateA11yLabel: {
    year: "numeric",
    month: "long",
    day: "numeric"
  },
  monthYearA11yLabel: {
    year: "numeric",
    month: "long"
  }
};

@Component({
  templateUrl: "./verify-your-identity.component.html",
  styleUrls: ["./verify-your-identity.component.scss"],
  providers: [
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: BIRTH_DATE_FORMATS
    }
  ]
})
export class VerifyYourIdentityComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;

  foiRequest: FoiRequest;
  targetKey: string = "contactInfo";
  infoBlock: string;
  includeBirthDate: boolean = false;
  decodedToken: any;
  isAuthenticated: boolean = false;

  foiForm: FormGroup;

  private birthDateInputValid: boolean = true;

  constructor(private fb: FormBuilder, private dataService: DataService, private keycloak: KeycloakService) {}

  ngOnInit() {
    const token = this.keycloak.getDecodedToken();
    this.isAuthenticated = token !== undefined && token.sub !== undefined;
    this.foiForm = this.fb.group({
      firstName: [
        { value: token.firstName, disabled: this.isAuthenticated },
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      middleName: [null, [Validators.maxLength(255)]],
      lastName: [
        { value: token.lastName, disabled: this.isAuthenticated },
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      birthDate: [null],
      alsoKnownAs: [null, Validators.compose([Validators.maxLength(255)])],
      businessName: [null, [Validators.maxLength(255)]],
    });

    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    if (this.isAuthenticated) {
      this.foiRequest.requestData[this.targetKey].firstName = token.firstName;
      this.foiRequest.requestData[this.targetKey].lastName = token.lastName;
      this.foiRequest.requestData[this.targetKey].birthDate = token.birthDate;
    }

    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    this.base.getFoiRouteData().subscribe((data) => {
      if (data) {
        this.infoBlock = data.infoBlock;
        this.includeBirthDate = data.includeBirthDate;
        if (this.includeBirthDate) {
          const currentValue = this.foiForm.get("birthDate").value;
          this.foiForm.setControl(
            "birthDate",
            new FormControl(currentValue, [
              Validators.required,
              this.base.noFutureValidator,
              this.birthDateFormatValidator
            ])
          );
        }
      }
    });
  }

  birthDateFormatValidator = () => {
    return this.birthDateInputValid
      ? null
      : {
          validDate: {
            valid: false
          }
        };
  };

  validateBirthDateInput(event: any) {
    const rawValue = event.input ? event.input.value : "";
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(rawValue);

    this.birthDateInputValid = false;

    if (match) {
      const month = Number.parseInt(match[1], 10);
      const day = Number.parseInt(match[2], 10);
      const year = Number.parseInt(match[3], 10);
      const enteredDate = new Date(year, month - 1, day);

      this.birthDateInputValid =
        enteredDate.getFullYear() === year &&
        enteredDate.getMonth() === month - 1 &&
        enteredDate.getDate() === day;
    }

    this.foiForm.get("birthDate").updateValueAndValidity({ emitEvent: false });
  }

  doContinue() {
    // Copy out submitted form data.
    // this.foiRequest.requestData[this.targetKey] = {};
    const formData = this.foiForm.value;

    Object.keys(formData).forEach((k) => (this.foiRequest.requestData[this.targetKey][k] = formData[k]));

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
