import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStarted2Component } from './getting-started2.component';
import { FoiValidComponent } from 'src/app/utils-components/foi-valid/foi-valid.component';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MockDataService, MockRouter } from '../../MockClasses';
import { Router } from '@angular/router';

describe('GettingStarted2Component', () => {
  let component: GettingStarted2Component;
  let fixture: ComponentFixture<GettingStarted2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingStarted2Component, BaseComponent, FoiValidComponent],
      imports:[ReactiveFormsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStarted2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
