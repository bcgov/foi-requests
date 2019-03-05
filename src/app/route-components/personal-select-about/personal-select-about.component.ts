import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { Observable, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './personal-select-about.component.html',
  styleUrls: ['./personal-select-about.component.scss']
})
export class PersonalSelectAboutComponent implements OnInit {
    @ViewChild(BaseComponent) base: BaseComponent;
    foiForm = this.fb.group({
      // values include [yourself, childUnder12, anotherPerson]
      requestAbout: [null, [Validators.required]]
    });
  
    foiRequest: FoiRequest;
    formData$: Observable<any>;

    constructor(private fb: FormBuilder, private dataService: DataService) {}
  
    ngOnInit() {
      this.foiRequest = this.dataService.getCurrentState();
      // The template does the actual subscribe, when that happens
      // this line will ensure that the reactive form is populated with data.
      this.formData$ = of(this.foiRequest.requestData.requestAbout || {}).pipe(
        tap(data => this.foiForm.patchValue(data))
      );
    }
  
    doContinue() {
      // Initialize & copy out submitted form data.
      this.foiRequest.requestData.requestAbout = {};
      const formData = this.foiForm.value;
      Object.keys(formData).map(
        k => (this.foiRequest.requestData.requestAbout[k] = formData[k])
      );
      // Update save data & proceed.
      this.dataService.setCurrentState(this.foiRequest);
      this.base.goFoiForward();
    }
  
    doGoBack() {
      this.base.goFoiBack();
    }
}
