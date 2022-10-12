import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  templateUrl: './youthincare-parent.component.html',
  styleUrls: ['./youthincare-parent.component.scss']
})
export class YouthInCareParent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  foiForm = this.fb.group({
    youthincareparentselection: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  targetKey: string = "youthincareparent";

  youthincareoptions: Observable<any>;
  mainoptions:Array<any>;

  constructor(private fb: FormBuilder, private dataService: DataService, private route:Router) {}

  ngOnInit() {
  
  
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    let selectedyouthincare = this.foiRequest.requestData[this.targetKey].selectedyouthincare;

    this.youthincareoptions = this.dataService.getYouthinCareParent().pipe(
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
    //this.base.goFoiForward();
    this.forwardforSelectedPersonalTopics();
  }

  doGoBack() {
    this.base.goFoiBack();
  }

  
  forwardforSelectedPersonalTopics()
  {
    if(this.foiRequest.requestData.selectedtopics!=undefined && this.foiRequest.requestData.selectedtopics.length > 0)
    {
      
      let current = this.foiRequest.requestData.selectedtopics.find(st=>st.value === this.targetKey)
      let ci = this.foiRequest.requestData.selectedtopics.indexOf(current)
      let next = this.foiRequest.requestData.selectedtopics[ci+1];
      console.log(`next childprotectionparent : ${JSON.stringify(next)}`)
      if(next!=undefined)
      {
        this.route.navigate([`/personal/${next.value}`])
      }
      else{
        this.base.goFoiForward();
      }
        
    }
    else
    {
      this.base.goFoiForward();
    }
  }


 
}
