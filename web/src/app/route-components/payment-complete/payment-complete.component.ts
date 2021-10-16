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
  transactionId = null;
  requestId= null;
  payResponseUrl= null;
  foiRequest: FoiRequest;
  authToken= null;
  captchaNonce= null;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.transactionId = params.transactionId
      this.requestId = params.requestId;
      this.payResponseUrl = params.payResponseUrl;
      this.updateTransaction();
    });
    this.foiRequest = this.dataService.getCurrentState();
    this.authToken = this.dataService.getAuthToken();
    this.captchaNonce = this.dataService.getCaptchaNonce();
  }

  updateTransaction() {
    this.dataService.updateTransaction({
      transactionId: this.transactionId,
      requestId: this.requestId,
      payResponseUrl: this.payResponseUrl
    }).subscribe(result => {
      if (result.statusCode === 'COMPLETED') {
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
