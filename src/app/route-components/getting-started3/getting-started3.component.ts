import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { Observable, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './getting-started3.component.html',
  styleUrls: ['./getting-started3.component.scss']
})
export class GettingStarted3Component implements OnInit {
    @ViewChild(BaseComponent) base: BaseComponent;
    gettingStarted3 = this.fb.group({
      // values include [general, personal]
      requestType: [null, [Validators.required]]
    });
  
    foiRequest: FoiRequest;
    gettingStarted3$: Observable<any>;

    constructor(private fb: FormBuilder, private dataService: DataService) {}
  
    ngOnInit() {
      this.foiRequest = this.dataService.getCurrentState();
      console.log('Loaded gs3:', this.foiRequest.requestData);
  
      // The template does the actual subscribe, when that happens
      // this line will ensure that the reactive form is populated with data.
      this.gettingStarted3$ = of(this.foiRequest.requestData.requestType || {}).pipe(
        tap(data => this.gettingStarted3.patchValue(data))
      );
    }
  
    doContinue() {
      // Initialize & copy out submitted form data.
      this.foiRequest.requestData.requestType = {};
      const formData = this.gettingStarted3.value;
      // Object.keys(formData).map(
      //   k => (this.foiRequest.requestData.requestType[k] = formData[k])
      // );
      // Update save data & proceed.
      this.dataService.setCurrentState(this.foiRequest);
      this.base.goFoiForward(formData.requestType);
    }
  
    doGoBack() {
      this.base.goFoiBack();
    }
}
