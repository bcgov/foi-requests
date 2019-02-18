import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { Observable, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './select-about.component.html',
  styleUrls: ['./select-about.component.scss']
})
export class SelectAboutComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    yourself: null,
    child: null,
    another: null
  });

  foiRequest: FoiRequest;
  foiForm$: Observable<any>;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    console.log('Loaded SelectAbout:', this.foiRequest.requestData);

    // The template does the actual subscribe, when that happens
    // this line will ensure that the reactive form is populated with data.
    this.foiForm$ = of(this.foiRequest.requestData.requestType || {}).pipe(
      tap(data => this.foiForm.patchValue(data))
    );
  }

  doContinue() {
    // Initialize & copy out submitted form data.
    this.foiRequest.requestData.requestType = {};
    const formData = this.foiForm.value;
    // Object.keys(formData).map(
    //   k => (this.foiRequest.requestData.requestType[k] = formData[k])
    // );
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);

    // Note: The order these are added is important!
    // Strings created are matched against the keys in data.json.
    let result = [];
    if (formData.yourself === true) {
      result.push('yourself');
    }
    if (formData.child === true) {
      result.push('child');
    }
    if (formData.another === true) {
      result.push('another');
    }

    if (result.length > 0) {
      const key = result.join('-');
      this.base.goFoiForward(key);
    }
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
