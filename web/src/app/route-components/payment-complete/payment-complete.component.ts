import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';
import { BaseComponent } from 'src/app/utils-components/base/base.component';

@Component({
  selector: 'app-payment-complete',
  templateUrl: './payment-complete.component.html',
  styleUrls: ['./payment-complete.component.scss']
})
export class PaymentCompleteComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  busy= true;
  completeBusy= false;
  paymentSuccess= false;
  paymentId = null;
  requestId= null;
  responseUrl= null;
  foiRequest: FoiRequest;
  authToken= null;
  captchaNonce= null;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.paymentId = params.paymentId
      this.requestId = params.requestId;
      this.responseUrl = window.location.href.split('?')[1]
      this.updateTransaction();
    });
    this.foiRequest = this.dataService.getCurrentState();
    
    this.foiRequest.requestData.requestId = this.paymentId;
    this.dataService.setCurrentState(this.foiRequest);

    this.authToken = this.dataService.getAuthToken();
    this.captchaNonce = this.dataService.getCaptchaNonce();
  }

  updateTransaction() {
    this.dataService.updateTransaction({
      paymentId: this.paymentId,
      requestId: this.requestId,
      responseUrl: this.responseUrl
    }).subscribe(result => {
      if (result.status === 'PAID') {
        this.paymentSuccess = true;
        this.busy = false;
      } else {
        this.paymentSuccess = false;
        this.busy = false;
      }
    })
  }

  doContinue() {
    this.completeBusy= true;
    this.submitEmail();
  }

  submitEmail() {
    this.dataService.submitRequest(this.authToken, this.captchaNonce, this.foiRequest, true).subscribe(result => {
      if(result.EmailSuccess) {
        this.base.goFoiForward();
      }
    }, error => {      
      this.completeBusy = false;
      console.log('Email submission failed: ', error);
      alert('Temporarily unable to complete your request. Please try again in a few minutes.'
      + ' If you\'re still having issues please contact us to complete your request.');
    })
  }
}
