import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { DataService } from 'src/app/services/data.service';
import { FoiRequest } from 'src/app/models/FoiRequest';

@Component({
  selector: 'app-review-submit-demo',
  templateUrl: './review-submit-demo.component.html',
  styleUrls: ['./review-submit-demo.component.scss']
})
export class ReviewSubmitDemoComponent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  get thisRequest():string {
    return JSON.stringify(this.foiRequest.requestData, null, 2);
  }

  submitDone: Boolean = false;

  foiRequest: FoiRequest;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
  }
  
  doContinue() {
    console.log("Going to submit");
    this.dataService.submitRequest(this.foiRequest).subscribe(result => {
      console.log("result: ", result);

      this.submitDone = true;
    });
  }
  doGoBack() {
    this.base.goFoiBack();
  }


}
