import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';
import { BaseComponent } from 'src/app/utils-components/base/base.component';

//'src/app/utils-components/base/base.component'
@Component({
  selector: 'app-adoptive-parents',
  templateUrl: './adoptive-parents.component.html',
  styleUrls: ['./adoptive-parents.component.scss']
})
export class AdoptiveParentsComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    motherFirstName: [null, Validators.maxLength(255)],
    motherLastName: [null, Validators.maxLength(255)],
    fatherFirstName: [null, Validators.maxLength(255)],
    fatherLastName: [null, Validators.maxLength(255)]
  });

  foiRequest: FoiRequest;
  targetKey: string = 'adoptiveParents';

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
  }

  doContinue() {
    // Update save data & proceed.
    this.dataService.setCurrentState(
      this.foiRequest,
      this.targetKey,
      this.foiForm
    );
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
