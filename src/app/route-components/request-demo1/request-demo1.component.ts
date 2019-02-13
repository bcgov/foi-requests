import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '../base/base.component';
import { DataService } from 'src/app/services/data.service';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-request-demo1',
  templateUrl: './request-demo1.component.html',
  styleUrls: ['./request-demo1.component.scss']
})
export class RequestDemo1Component implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  demoForm = this.fb.group({
    // firstname: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    // lastname: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    firstname: '',
    lastname: '',
    ministry: '',
    email: '',
    puppies: ''
  });

  foiRequest: FoiRequest;
  demo1$: Observable<any>;
  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    console.log('Loaded demo1:', this.foiRequest.requestData.demo1);

    // The template does the actual subscribe, when that happens
    // this line will ensure that the reactive form is populated with data.
    this.demo1$ = of(this.foiRequest.requestData.demo1 || {}).pipe(
      tap(data => this.demoForm.patchValue(data))
    );
  }

  doContinue() {
    // Initialize & copy out submitted form data.
    this.foiRequest.requestData.demo1 = {};
    const formData = this.demoForm.value;
    Object.keys(formData).map(
      k => (this.foiRequest.requestData.demo1[k] = formData[k])
    );
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
