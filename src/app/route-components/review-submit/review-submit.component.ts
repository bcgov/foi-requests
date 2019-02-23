import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { DataService } from 'src/app/services/data.service';
import { FoiRequest } from 'src/app/models/FoiRequest';

@Component({
  templateUrl: './review-submit.component.html',
  styleUrls: ['./review-submit.component.scss']
})
export class ReviewSubmitComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;

  foiRequest: FoiRequest;
  contactInfoA: any;
  foiRequestPretty: string;
  captchaApiBaseUrl: string = '/api';
  authToken: string = '';
  captchaNonce: string = '69879887sdsas$#';
  constructor(private dataService: DataService) {}


  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    this.contactInfoA = this.foiRequest.requestData.contactInfoA;

    this.foiRequestPretty = JSON.stringify(this.foiRequest, null, 2);
  }

  onValidToken(tokenEvent){
    this.authToken = tokenEvent.replace('\n','') ;
  }

  doContinue() {
    console.log("Going to submit");
    this.dataService.submitRequest(this.authToken, this.captchaNonce, this.foiRequest).subscribe(result => {
      console.log("result: ", result);

    });
  }
  doGoBack() {
    this.base.goFoiBack();
  }
}
