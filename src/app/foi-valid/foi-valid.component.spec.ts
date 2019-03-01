import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoiValidComponent } from './foi-valid.component';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  template:`<app-foi-valid
  [form]="testform"
  maxLength="maximum 10 characters."
>
  <label>Sample label:</label>
  <input formControlName="samplecontrol" />
</app-foi-valid>`
})
class TestHostComponent {
  testform: any;
  constructor(private fb: FormBuilder){
    this.testform = fb.group({
      samplecontrol:''
    })
  }
}

describe('FoiValidComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ FoiValidComponent, TestHostComponent ],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
