import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Observable, of } from 'rxjs';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './ministry-confirmation.component.html',
  styleUrls: ['./ministry-confirmation.component.scss']
})
export class MinistryConfirmationComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    // values include [general, personal]
    requestType: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  foiForm$: Observable<any>;
  ministries$: Observable<any>;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    console.log('Loaded ministryConfirmation:', this.foiRequest.requestData);

    this.ministries$ = this.dataService.getMinistries();
    // The template does the actual subscribe, when that happens
    // this line will ensure that the reactive form is populated with data.
    this.foiForm$ = of(
      this.foiRequest.requestData.requestType || {}
    ).pipe(tap(data => this.foiForm.patchValue(data)));
  }

  doContinue() {
    this.base.goFoiForward();
  }
  doGoBack() {
    this.base.goFoiBack();
  }
}
