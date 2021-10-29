import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { WindowRefService } from 'src/app/services/window-ref.service';

@Component({
  selector: 'app-payment-complete',
  templateUrl: './payment-complete.component.html',
  styleUrls: ['./payment-complete.component.scss']
})
export class PaymentCompleteComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  busy= true;
  paymentSuccess= false;
  paymentId = null;
  requestId= null;
  responseUrl= null;
  foiRequest: FoiRequest;
  authToken= null;
  captchaNonce= null;
  paybcUrl= null;
  retry = false;

  transactionNumber = null;
  amount = null;
  transactionOrderId = null;

  constructor(private dataService: DataService, private route: ActivatedRoute, private windowRefService: WindowRefService) { }
  
  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.transactionNumber = queryParams.pbcTxnNumber;
      this.amount = queryParams.trnAmount;
      this.transactionOrderId = queryParams.trnOrderId;
    })

    this.route.params.subscribe(params => {
      this.paymentId = params.paymentId
      this.requestId = params.requestId;
      this.responseUrl = window.location.href.split('?')[1]

      this.foiRequest = this.dataService.getCurrentState();
      this.foiRequest.requestData.requestId = this.paymentId;
      this.dataService.setCurrentState(this.foiRequest);

      this.updateTransaction();
      
    });

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
        this.submitEmail();
      } else {
        this.paymentSuccess = false;

        if(result.paybc_url) {
          this.retry = true;
          this.paybcUrl = result.paybc_url
        } else {
          alert(`It seems there was an error completing your payment of transaction number: ${this.transactionNumber}.`
          + `Please contact us to investigate`)

        }
      }
      this.busy = false;
    }, error => {
      this.busy = false
    })
  }

  doContinue() {
    this.base.goFoiForward();
  }

  doRetry() {
    this.windowRefService.goToUrl(this.paybcUrl)
  }

  submitEmail() {
    this.foiRequest.requestData.paymentInfo = {
      transactionNumber: this.transactionNumber,
      amount: this.amount,
      transactionOrderId: this.transactionOrderId
    }
    this.dataService.submitRequest(this.authToken, this.captchaNonce, this.foiRequest, true).subscribe(result => {
      if(!result.EmailSuccess) {
        alert('Temporarily unable to complete your request. Please contact us to complete your request.');
      }
    }, error => {
      console.log('Email submission failed: ', error);
      alert('Temporarily unable to complete your request. Please contact us to complete your request.');
    })
  }
}
