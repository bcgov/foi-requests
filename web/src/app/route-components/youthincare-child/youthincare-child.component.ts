import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
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

  constructor(private fb: FormBuilder, private dataService: DataService, private route:Router) { }

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

    //this.base.goFoiForward();
    this.forwardforSelectedPersonalTopics()
  }

  doGoBack() {
    //this.base.goFoiBack();
    this.rewindforSelectedPersonalTopics();
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

  rewindforSelectedPersonalTopics()
  {
    if(this.foiRequest.requestData.selectedtopics!=undefined && this.foiRequest.requestData.selectedtopics.length > 0)
    {
      
      let current = this.foiRequest.requestData.selectedtopics.find(st=>st.value === this.targetKey)
      let ci = this.foiRequest.requestData.selectedtopics.indexOf(current)
      let previous = this.foiRequest.requestData.selectedtopics[ci-1];
      console.log(`next childprotectionparent : ${JSON.stringify(previous)}`)
      if(previous!=undefined)
      {
        this.route.navigate([`/personal/${previous.value}`])
      }
      else{
        this.base.goFoiBack();
      }
        
    }
    else
    {
      this.base.goFoiBack();
    }
  }


}
