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
  checkstates:Array<string> = ['adoption','childprotectionchild','childprotectionparent','fosterparent','youthincarechild','youthincareparent'];
  youthincareoptions: Observable<any>;
  mainoptions:Array<any>;

  constructor(private fb: FormBuilder, private dataService: DataService, private route:Router) {}

  ngOnInit() {
  
  
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    let selectedoptions = this.foiRequest.requestData.requestType.youthincareparent;

    this.youthincareoptions = this.dataService.getYouthinCareParent().pipe(
      map(_mainoptions => {
        _mainoptions.forEach(_mainoption => {
          _mainoption.selected = _mainoption.selected || (selectedoptions ? !!selectedoptions.find(smo => smo.mainoption === _mainoption.mainoption) : false);

          let _suboptions = _mainoption.suboptions
          let selectedmainoption = selectedoptions ? selectedoptions.find(smo => smo.mainoption === _mainoption.mainoption) : []

          _suboptions.forEach(_suboption => {
            if (selectedmainoption != undefined) {
              _suboption.selected = (selectedmainoption && selectedmainoption.suboptions ? !!selectedmainoption.suboptions.find(sso => sso.option === _suboption.option && sso.selected === true) : false)
            }
          })
        })

        return _mainoptions;
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
    this.foiRequest.requestData.requestType.youthincareparent = selected;
    
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    //this.base.goFoiForward();
    this.forwardforSelectedPersonalTopics();
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
      if(next!=undefined  && this.checkstates.includes(next.value))
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
