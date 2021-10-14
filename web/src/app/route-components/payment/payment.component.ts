import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {  
  @ViewChild(BaseComponent) base: BaseComponent;
  fee= null;
  foiRequest: FoiRequest;
  feeCode = 'FOI010'
  isBusy = true;

  ministryKey = "ministry"

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();

    const feeDetails = {
      selectedMinistry: this.foiRequest.requestData[this.ministryKey].ministry
    }

    this.dataService.getFeeDetails(this.feeCode, feeDetails).subscribe(result => {
      this.fee = result.fee;
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

  }
}
