import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildInformationComponent } from './child-information.component';
import { BaseComponent } from '../base/base.component';
import { FoiValidComponent } from 'src/app/foi-valid/foi-valid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MockDataService, MockRouter } from '../MockClasses';
import { Router } from '@angular/router';
import { FoiFileinputComponent } from '../foi-fileinput/foi-fileinput.component';

describe('ChildInformationComponent', () => {
  let component: ChildInformationComponent;
  let fixture: ComponentFixture<ChildInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildInformationComponent, BaseComponent, FoiValidComponent, FoiFileinputComponent ],
      imports:[ReactiveFormsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
