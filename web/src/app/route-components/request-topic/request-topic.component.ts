import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { componentNeedsResolution } from "@angular/core/src/metadata/resource_loading";
@Component({
  templateUrl: "./request-topic.component.html",
  styleUrls: ["./request-topic.component.scss"]
})
export class RequestTopicComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    requestTopic: [null, [Validators.required]],
    selectedoptions: this.fb.array([])
  });

  foiRequest: FoiRequest;
  topics: Array<any> = [];
  yourselftopics: Observable<any>;
  //mainoptions:Array<any>;
  targetKey: string = "requestTopic";
  ministryKey: string = "ministry";
  checkstates: Array<string> = ['adoption', 'childprotectionchild', 'childprotectionparent', 'fosterparent', 'youthincarechild', 'youthincareparent'];
  constructor(private fb: FormBuilder, private dataService: DataService, private route: Router, private elRef: ElementRef) { }

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey, this.ministryKey);
    
    if(this.foiRequest.requestData.selectedtopics === undefined)
    {
      this.foiRequest.requestData.selectedtopics = []
    }

    this.base.getFoiRouteData().subscribe(data => {
      if (data) {

        const formInit = {
          requestTopic: null,
          selectedoptions: []
        };
        formInit.requestTopic = this.topics.find(t => t.value === this.foiRequest.requestData.selectedtopics[0]);

        formInit.selectedoptions = this.foiRequest.requestData.selectedtopics
      
        let selectedtopics = this.foiRequest.requestData.selectedtopics;

        this.base.continueDisabled = this.disablecontinue("init")

        this.yourselftopics = this.dataService.getYourselfTopics().pipe(
          map(_topics => {
            _topics.forEach(topic => {
              topic.selected = topic.selected || (selectedtopics ? !!selectedtopics.find(ms => ms.value === topic.value) : false);

              if(topic.selected === true)
              {
                this.base.continueDisabled = false
              }

            })

            return _topics;
          }),
          map(topics => {
            this.topics = topics;
            return topics;
          })
        );
      }
      
    });

    
    
  }

  disablecontinue(loadingpoint :string)
  {
    let selectedoptions = this.foiRequest.requestData.selectedtopics;
    let disable = false;
    if(selectedoptions !=undefined && loadingpoint === "init")
    {      
      disable = selectedoptions.length > 0  ?  selectedoptions.filter(so=>so.selected === true).length === 0 : true
    }  

    if (loadingpoint === "select") {
      disable = (this.topics === undefined || this.topics.filter(mo=>mo.selected === true).length === 0)
    }   
     return disable;
  }

  selecttopic(item: any, _checked) {
    item.selected = !item.selected
    let current = this.foiRequest.requestData.selectedtopics.find(st => st.value === item.value)
    const itemindex: number = this.foiRequest.requestData.selectedtopics.indexOf(current)

    if (!this.foiRequest.requestData.selectedtopics.includes(item) && itemindex === -1) {

      this.foiRequest.requestData.selectedtopics.push(item)
    }
    else {

      this.foiRequest.requestData.selectedtopics.splice(itemindex, 1)
    }

    this.base.continueDisabled = this.disablecontinue("select")

  }

  /**
   * Used to disable the Continue button.
   */
  allowContinue() {
    let result = false;
    const formData = this.foiForm.value;

    if (formData.selectedoptions && formData.selectedoptions.length > 0) {
      result = true;
    }
    return result;
  }

  doContinue() {
    // Initialize & copy out submitted form data.
    this.foiRequest.requestData[this.targetKey] = {};
    const formData = this.foiForm.value;

    let selected = this.topics.filter(m => m.selected && m.hassubscreen === "true");
    this.foiRequest.requestData.selectedtopics = selected.sort((a, b) => a.value.localeCompare(b.value));

    this.dataService.getMinistries().subscribe(ministries => {

      let _selectedtopic = this.foiRequest.requestData.selectedtopics[0];

      if (_selectedtopic === undefined) {
        _selectedtopic = this.topics.filter(m => m.selected)[0]
      }

      this.foiRequest.requestData[this.targetKey] = _selectedtopic

      const selection = this.foiRequest.requestData[this.targetKey].value;

      const ministryCode = this.foiRequest.requestData[this.targetKey].ministryCode;
      const ministryMatch = ministries.find(m => m.code === ministryCode);
      if (ministryCode && !ministryMatch) {
        return alert(`Invalid defaultMinistry (${ministryCode}), please contact the system administrator`);
      }
      this.foiRequest.requestData[this.ministryKey].defaultMinistry = ministryMatch;
      this.dataService.setCurrentState(this.foiRequest);
      this.base.goFoiForward(selection);
    });
  }



  doGoBack() {
    this.foiRequest.requestData.selectedtopics = this.yourselftopics
    this.base.goFoiBack();
  }
}
