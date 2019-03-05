import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStarted1Component } from './getting-started1.component';
import { FoiValidComponent } from 'src/app/utils-components/foi-valid/foi-valid.component';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MockDataService, MockRouter } from '../../MockClasses';
import { Router } from '@angular/router';

describe('GettingStarted1Component', () => {
  let component: GettingStarted1Component;
  let fixture: ComponentFixture<GettingStarted1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingStarted1Component, BaseComponent, FoiValidComponent ],
      imports:[ReactiveFormsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStarted1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
