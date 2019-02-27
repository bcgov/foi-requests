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
    const navigateTo = this.allowContinue();
    console.log('navigateTo:', navigateTo);
    this.foiRequest.requestData["ministry"] = this.foiRequest.requestData["ministry"] || {};
    if (navigateTo.indexOf('child') >= 0){
      this.foiRequest.requestData.requestTopic = {text: "Child protection and youth care"};
      this.foiRequest.requestData.ministry.default = { "code": "MCF", "name": "Children and Family Development" };
    }
    // Update save data & proceed.
    this.dataService.setCurrentState(
      this.foiRequest,
      this.targetKey,
      this.foiForm
    );
    
    this.base.goFoiForward(navigateTo);
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
