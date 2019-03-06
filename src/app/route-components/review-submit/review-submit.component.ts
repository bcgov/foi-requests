import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { DataService } from 'src/app/services/data.service';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { CaptchaComponent } from 'src/app/utils-components/captcha/captcha.component';

@Component({
  templateUrl: './review-submit.component.html',
  styleUrls: ['./review-submit.component.scss']
})
export class ReviewSubmitComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  @ViewChild('captchaComponent') captchaComponent: CaptchaComponent 

  foiRequest: FoiRequest;
  foiRequestPretty: string;
  captchaApiBaseUrl: string = '/api';
  captchaComplete: boolean = false;
  isBusy: boolean = false; // during submit!
  authToken: string = '';
  captchaNonce: string = '69879887sdsas$#';
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    if (!this.foiRequest.requestData.requestType) {
      // TODO: base.backToRoot(); // !
    }
    // foiRequestPretty is used for debugging only
    this.foiRequestPretty = JSON.stringify(this.foiRequest, null, 2);
  }

  onValidToken(tokenEvent){
    this.authToken = tokenEvent.replace('\n','') ;
    this.captchaComplete = true;
  }

  submitDisabled () {
    return this.isBusy || !this.captchaComplete;
  }

  doContinue() {
    this.isBusy = true;
    this.dataService.submitRequest(this.authToken, this.captchaNonce, this.foiRequest).subscribe(result => {
      console.log("result: ", result);
      this.isBusy = false;
      this.base.goFoiForward();

    }, error => {
      this.isBusy = false;
      console.log("That submit failed: ", error);
      alert("Temporarily unable to submit your request. Please try again in a few minutes.");
      this.captchaComponent.forceRefresh();
      this.captchaComplete = false;
    });
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
