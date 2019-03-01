import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { DataService } from 'src/app/services/data.service';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { CaptchaComponent } from '../captcha/captcha.component';

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
  authToken: string = '';
  captchaNonce: string = '69879887sdsas$#';
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    // foiRequestPretty is used for debugging only
    this.foiRequestPretty = JSON.stringify(this.foiRequest, null, 2);
  }

  onValidToken(tokenEvent){
    this.authToken = tokenEvent.replace('\n','') ;
    this.captchaComplete = true;
  }

  doContinue() {
    this.dataService.submitRequest(this.authToken, this.captchaNonce, this.foiRequest).subscribe(result => {
      console.log("result: ", result);
      this.base.goFoiForward();

    }, error => {
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
