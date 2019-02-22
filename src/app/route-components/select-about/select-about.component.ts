import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

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
  targetKey: string = 'selectAbout';

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
  }

  /**
   * Used to disable the Continue button *and* determine the navigation path.
   */
  allowContinue() {
    const formData = this.foiForm.value;
    // Note: The order these are added is important!
    // Return value is matched against the keys in data.json.
    let checks = [];
    const checkboxes = ['yourself', 'child', 'another'];
    checkboxes.map(c => {
      if (formData[c]) {
        checks.push(c);
      }
    });
    return checks.join('-');
  }

  doContinue() {
    // Update save data & proceed.
    this.dataService.setCurrentState(
      this.foiRequest,
      this.targetKey,
      this.foiForm
    );
    const navigateTo = this.allowContinue();
    this.base.goFoiForward(navigateTo);
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
