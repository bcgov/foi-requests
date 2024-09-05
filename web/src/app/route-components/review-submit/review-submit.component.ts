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
    this.isBusy = true;
    this.dataService.submitRequest(this.authToken, this.captchaNonce, this.foiRequest).subscribe(
      (result) => {
        this.foiRequest.requestData.requestId = result.id;
        this.dataService.setCurrentState(this.foiRequest);
        this.dataService.saveAuthToken(this.authToken);

        this.isBusy = false;
        // If the user is authenticated, logout the user
        if (this.keycloakService.isAuthenticated()) {
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
        // if (this.keycloakService.isAuthenticated()) {
        //   this.keycloakService.logout();
        // } else {
        //   this.base.goFoiForward();
        // }
      }
    );
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
