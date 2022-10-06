import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ContactInfoOptionsComponent } from '../contact-info-options/contact-info-options.component';
@Component({
  templateUrl: './youthincare-child.component.html',
  styleUrls: ['./youthincare-child.component.scss']
})
export class YouthInCareChild implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  foiForm = this.fb.group({
    youthincarechildselection: [null, [Validators.required]],
    ischildincardrecords:false,
    ismentalhealthrecords:false,
    isspecialneedsrecords:false,
    isyouthagreement:false,
    isyouthjustice:false,
    isother:false
    
  });

  foiRequest: FoiRequest;
  targetKey: string = "youthincarechild";
 
  youthincareoptions: Observable<any>;
  mainoptions:Array<any>;

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit() {

    

    //console.log(JSON.stringify(this.youthincareoptions))

    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);    
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    let selectedyouthincare = this.foiRequest.requestData[this.targetKey].selectedyouthincare;

    this.youthincareoptions = this.dataService.getYouthinCareChild().pipe(
      map(mainoptions=>{
          mainoptions.forEach(mainoption =>{
            mainoption.selected =  mainoption.selected || (selectedyouthincare ? !! selectedyouthincare.find(ms => ms.selected === mainoption.selected) : false);
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
    this.foiRequest.requestData[this.targetKey].selectedyouthincare = selected; 
    
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    console.log(`Key  ${JSON.stringify(selected)}`);

    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }


}
