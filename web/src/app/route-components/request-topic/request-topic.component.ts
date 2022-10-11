import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
@Component({
  templateUrl: "./request-topic.component.html",
  styleUrls: ["./request-topic.component.scss"]
})
export class RequestTopicComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    requestTopic: [null, [Validators.required]],
    selectedoptions:this.fb.array([])
  });

  foiRequest: FoiRequest;
  topics: Array<any> = [];
  yourselftopics:Observable<any>;
  //mainoptions:Array<any>;
  targetKey: string = "requestTopic";
  ministryKey: string = "ministry";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey, this.ministryKey);
    console.log(`this.foiRequest.requestData.selectedtopics ${this.foiRequest.requestData.selectedtopics}`)

    this.base.getFoiRouteData().subscribe(data => {
      if (data) {

        //this.topics = this.dataService.getTopics(data.topics);
       
        
        const formInit = {
          requestTopic: null,
          selectedoptions:[]
        };
        formInit.requestTopic = this.topics.find(t => t.value === this.foiRequest.requestData.selectedtopics[0]);
        //formInit.requestTopic = "fosterparent";
        formInit.selectedoptions =  this.foiRequest.requestData.selectedtopics
        
        this.foiForm.patchValue(formInit);

       

        let selectedtopics = this.foiRequest.requestData.selectedtopics;
        console.log(`ngOnInit load event ${JSON.stringify(selectedtopics)}`)

        this.yourselftopics = this.dataService.getYourselfTopics().pipe(
          map(topics=>{
            topics.forEach(topic =>{
              topic.selected =  topic.selected || (selectedtopics ? !! selectedtopics.find(ms => ms.value === topic.value) : false);
             
            })
  
            return topics;
        }),
        map(topics => {
          this.topics = topics;
          return topics;
        })
        );

        console.log(`ngOnInit load event this.yourselftopics ${JSON.stringify(this.yourselftopics)}`)

      }
    });

    // Set the continue button state
    this.foiForm.valueChanges.subscribe(() => {
      
      console.log(`this.foiForm.valueChanges.subscribe ${JSON.stringify(this.foiRequest.requestData.selectedtopics)}`)
     //this.base.continueDisabled = !this.allowContinue();
     
     
    });
  }

  selecttopic(item:any)
  {    
    item.selected=!item.selected
     
    const itemindex: number = this.foiForm.value.selectedoptions.indexOf(item);
    if(!this.foiForm.value.selectedoptions.includes(item) && itemindex === -1) 
    {
      console.log('added')
      this.foiForm.value.selectedoptions.push(item)
    } 
    else{
      console.log('revmoved')
      this.foiForm.value.selectedoptions.splice(itemindex,1)
    }

    this.foiRequest.requestData.selectedtopics = this.foiForm.value.selectedoptions;
    console.log(`selecttopic event ${JSON.stringify(this.foiForm.value.selectedoptions)}`)
     
  }

  /**
   * Used to disable the Continue button.
   */
  allowContinue() {
    let result = false;
    const formData = this.foiForm.value;
    
    if (formData.requestTopic && formData.requestTopic.value) {
      result = true;
    }
    return result;
  }

  doContinue() {
    // Initialize & copy out submitted form data.
    this.foiRequest.requestData[this.targetKey] = {};
    const formData = this.foiForm.value;

    console.log(`formData.selectedoptions -doContinue ${JSON.stringify(formData.selectedoptions)}`)

    let selected = this.topics.filter(m => m.selected);
    this.foiRequest.requestData.selectedtopics = selected; 

    console.log(`doContinue-selectedtopics ${JSON.stringify(this.foiRequest.requestData.selectedtopics)}`)

    this.dataService.getMinistries().subscribe(ministries => {
      this.foiRequest.requestData[this.targetKey] = this.foiRequest.requestData.selectedtopics[0];

      const selection = this.foiRequest.requestData[this.targetKey].value;
      console.log(`selection ${selection}`)
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
    this.base.goFoiBack();
  }
}
