import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { BaseComponent } from 'src/app/utils-components/base/base.component';

@Component({
  selector: 'app-payment-complete',
  templateUrl: './payment-complete.component.html',
  styleUrls: ['./payment-complete.component.scss']
})
export class PaymentCompleteComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  busy= true
  paymentSuccess= false;
  transactionId = null;
  requestId= null;
  payResponseUrl= null;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.transactionId = params.transactionId
      this.requestId = params.requestId;
      this.payResponseUrl = params.payResponseUrl;
      this.updateTransaction();
    });
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
    this.base.goFoiForward();
  }
}
