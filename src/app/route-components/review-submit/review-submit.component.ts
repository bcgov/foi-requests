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
  captchaApiBaseUrl: string = '/api';
  constructor(private dataService: DataService) {}


  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
  }

  doContinue() {
    console.log("Going to submit");
    this.dataService.submitRequest(this.foiRequest).subscribe(result => {
      console.log("result: ", result);

    });
  }
  doGoBack() {
    this.base.goFoiBack();
  }
}
