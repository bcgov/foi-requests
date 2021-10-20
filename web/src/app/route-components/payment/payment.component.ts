import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FeeRequestDetails } from 'src/app/models/FeeRequestDetails';
import { WindowRefService } from 'src/app/services/window-ref.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {  
  @ViewChild(BaseComponent) base: BaseComponent;
  fee= null;
  foiRequest: FoiRequest;
  feeCode = 'FOI0001'
  isBusy = true;
  payBusy = false;
  ministryKey = "ministry"
  feeDetails: FeeRequestDetails;

  constructor(private dataService: DataService, private windowRefService: WindowRefService ) { }

  ngOnInit() {
    console.log(this.getReturRoute())
    this.foiRequest = this.dataService.getCurrentState();

    this.feeDetails = {
      selectedMinistry: this.foiRequest.requestData[this.ministryKey].selectedMinistry
    }

    this.dataService.getFeeDetails(this.feeCode, this.feeDetails).subscribe(result => {
      this.fee = result.total;
      this.isBusy = false;
    }, error => {
      this.isBusy = false;
      console.log('Submission failed: ', error);
      alert('Temporary unable to fetch fee details. Please try again in a few minutes.');
      this.base.goFoiBack();
    })
  }

  doGoBack() {
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiBack();
  }

  doContinue() {
    this.payBusy = true;
    this.doCreateTransaction()
      .subscribe(transactionDetails => {
        if(transactionDetails.paybc_url) {
          this.windowRefService.goToUrl(transactionDetails.paybc_url)
        }
        else {
          this.transactionError();
        }
      }, error => {
        console.log('Submission failed: ', error);
        this.transactionError()
      })
  }

  private transactionError() {
    this.payBusy = false;
    alert('Temporary unable to proceed to payment. Please try again in a few minutes.');
  }

  private doCreateTransaction () {
    return this.dataService.createTransaction({
      feeCode: this.feeCode,
      quantity: this.dataService.calculateUnitFeeQuantity(this.feeDetails),
      requestId: this.foiRequest.requestData.requestId,
      returnRoute: this.getReturRoute()
    })
  }

  private getReturRoute() {
    const nextRoute = this.base.getCurrentRoute() + "-complete";
    return nextRoute;
  }
}
