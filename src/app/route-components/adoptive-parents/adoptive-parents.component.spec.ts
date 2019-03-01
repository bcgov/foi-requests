import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptiveParentsComponent } from './adoptive-parents.component';
import { BaseComponent } from '../base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FoiValidComponent } from 'src/app/foi-valid/foi-valid.component';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MockDataService, MockRouter } from '../MockClasses';


describe('AdoptiveParentsComponent', () => {
  let component: AdoptiveParentsComponent;
  let fixture: ComponentFixture<AdoptiveParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdoptiveParentsComponent, BaseComponent, FoiValidComponent ],
      imports:[ReactiveFormsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdoptiveParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
