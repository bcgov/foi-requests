import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStarted2Component } from './getting-started2.component';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MockDataService, MockRouter } from '../../MockClasses';
import { Router } from '@angular/router';
import { By } from "@angular/platform-browser";

describe('GettingStarted2Component', () => {
  let component: GettingStarted2Component;
  let fixture: ComponentFixture<GettingStarted2Component>;
  let dataService: DataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingStarted2Component, BaseComponent],
      imports:[ReactiveFormsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    dataService = TestBed.get(DataService);
    fixture = TestBed.createComponent(GettingStarted2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should go forward on continue click", done => {
    const baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
    const base: BaseComponent = baseDebug[0].componentInstance;

    spyOn(dataService, "setCurrentState").and.callThrough();
    spyOn(base, "goFoiForward").and.callThrough();
    const continueButton: HTMLInputElement = fixture.nativeElement.querySelector(".btn-primary");
    continueButton.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    // setCurrentState is NOT called on Getting-Started-2
    expect(dataService.setCurrentState).toHaveBeenCalledTimes(0);
    expect(base.goFoiForward).toHaveBeenCalledTimes(1);
    done();
  });  
});
