import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { Observable, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './request-topic.component.html',
  styleUrls: ['./request-topic.component.scss']
})
export class RequestTopicComponent implements OnInit {
    @ViewChild(BaseComponent) base: BaseComponent;
    foiForm = this.fb.group({
      // values include [general, personal]
      requestTopic: [null, [Validators.required]]
    });
  
    foiRequest: FoiRequest;
    foiForm$: Observable<any>;

    constructor(private fb: FormBuilder, private dataService: DataService) {}
  
    ngOnInit() {
      this.foiRequest = this.dataService.getCurrentState();
      console.log('Loaded requestTopic:', this.foiRequest.requestData);
  
      // The template does the actual subscribe, when that happens
      // this line will ensure that the reactive form is populated with data.
      this.foiForm$ = of(this.foiRequest.requestData.requestTopic || {}).pipe(
        tap(data => this.foiForm.patchValue(data))
      );
    }
  
    doContinue() {
      // Initialize & copy out submitted form data.
      this.foiRequest.requestData.requestTopic = {};
      const formData = this.foiForm.value;
      // Object.keys(formData).map(
      //   k => (this.foiRequest.requestData.requestType[k] = formData[k])
      // );
      // Update save data & proceed.
      this.dataService.setCurrentState(this.foiRequest);
      this.base.goFoiForward(formData.requestTopic);
    }
  
    doGoBack() {
      this.base.goFoiBack();
    }
}
