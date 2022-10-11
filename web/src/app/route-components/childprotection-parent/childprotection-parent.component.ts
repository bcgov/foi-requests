import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  templateUrl: './childprotection-parent.component.html',
  styleUrls: ['./childprotection-parent.component.scss']
})
export class ChildProtectionParent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  foiForm = this.fb.group({
    childprotectionparentselection: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  targetKey: string = "childprotectionparent";
  fulllistoptions: Observable<any>;
  mainoptions:Array<any>;
  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
  
  
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    console.log(`ngOnInit-childprot parent -selectedtopics ${JSON.stringify(this.foiRequest.requestData.selectedtopics)}`)
    let selectedoptions = this.foiRequest.requestData[this.targetKey].selectedoptions;

    this.fulllistoptions = this.dataService.getChildInProtectionParent().pipe(
      map(mainoptions=>{
          mainoptions.forEach(mainoption =>{
            mainoption.selected =  mainoption.selected || (selectedoptions ? !! selectedoptions.find(ms => ms.selected === mainoption.selected) : false);
          })

          return mainoptions;
      }),
      map(mainoptions => {
        this.mainoptions = mainoptions;
        return mainoptions;
      })
    );
  }

  showsubsection(item:any)
  {
    item.selected=!item.selected   
  }

  selectedsuboption(item:any)
  {
    item.selected=!item.selected 

  }

  doContinue() {

    const formData = this.foiForm.value;

    let selected = this.mainoptions.filter(m => m.selected);
    this.foiRequest.requestData[this.targetKey].selectedoptions = selected; 
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }

 
}