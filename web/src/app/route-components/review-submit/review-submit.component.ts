import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { DataService } from "src/app/services/data.service";
import { FoiRequest } from "src/app/models/FoiRequest";
import { CaptchaComponent } from "src/app/utils-components/captcha/captcha.component";
import { DomSanitizer } from "@angular/platform-browser";
import { KeycloakService } from "../../services/keycloak.service";

@Component({
  templateUrl: "./review-submit.component.html",
  styleUrls: ["./review-submit.component.scss"],
})
export class ReviewSubmitComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;
  @ViewChild("captchaComponent", { static: true }) captchaComponent: CaptchaComponent;

  foiRequest: FoiRequest;
  foiRequestPretty: string;
  captchaApiBaseUrl = "/api";
  captchaComplete = false;
  isBusy = false; // during submit!
  authToken = "";
  captchaNonce = "69879887sdsas$#";
  isAuthenticated = false;
  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    if (!this.foiRequest.requestData.requestType) {
      // TODO: base.backToRoot(); // !
    }
    // foiRequestPretty is used for debugging only
    this.foiRequestPretty = JSON.stringify(this.foiRequest, null, 2);
    this.isAuthenticated = this.keycloakService.isAuthenticated();

    // see if keycloak token is there.set it to authToken
    if (this.keycloakService.isAuthenticated()) {
      this.authToken = this.keycloakService.getToken();
      this.captchaComplete = true;
      this.captchaNonce = "";
    }
  }

  getBase64Data(storageKey) {
    const storedImage = sessionStorage[storageKey];
    const imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(storedImage);
    return imagePath;
  }

  onValidToken(tokenEvent) {
    this.authToken = tokenEvent.replace("\n", "");
    this.captchaComplete = true;
  }

  submitDisabled() {
    return this.isBusy || !this.captchaComplete;
  }

  doContinue() {
    console.log(
      '[REVIEW-SUBMIT COMPONENT]',
      new Date().toISOString(),
      'Submitting request'
    );
    if (this.isBusy) {
      console.trace('REQUEST-SUBMIT COMPONENT BLOCKED');
      return;
    }
    console.trace('REQUEST-SUBMIT COMPONENT ALLOWED');
    
    this.isBusy = true;
    this.dataService.submitRequest(this.authToken, this.captchaNonce, this.foiRequest).subscribe(
      (result) => {
        // Handle duplicate request
        if (!result.status) {
          console.log("submitFoiRequest Result: ", result)
          alert(
            `${result.message}.\n\n` +
            "This request was already submitted.\n\n" +
            "To prevent duplicates, you cannot resubmit the same request for 30 minutes.\n\n" +
            "Go back to the homepage and start a new request."
          );
          // this.captchaComponent.forceRefresh();
          // this.captchaComplete = false;
          // this.isBusy = false;
          return;
        }
        
        this.foiRequest.requestData.requestId = result.id;
        this.dataService.setCurrentState(this.foiRequest);
        this.dataService.saveAuthToken(this.authToken);
        // this.isBusy = false;

        // If the user is authenticated, logout the user
        if (this.keycloakService.isAuthenticated()) {
          const requestType = this.foiRequest.requestData.requestType;
          // Clear request state so a duplicate submission cannot resubmit the same data
          this.dataService.clearState({requestType: requestType});
          this.keycloakService.logout();
        } else {
          this.base.goFoiForward();
        }
      },
      (error) => {
        this.isBusy = false;

        alert("Temporarily unable to submit your request. Please try again in a few minutes.");
        this.captchaComponent.forceRefresh();
        this.captchaComplete = false;
      }
    );
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
