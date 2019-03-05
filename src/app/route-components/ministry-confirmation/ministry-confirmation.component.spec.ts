import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryConfirmationComponent } from './ministry-confirmation.component';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FoiValidComponent } from 'src/app/utils-components/foi-valid/foi-valid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MockDataService, MockRouter } from '../../MockClasses';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertInfoComponent } from 'src/app/utils-components/alert-info/alert-info.component';


describe('MinistryConfirmationComponent', () => {
  let component: MinistryConfirmationComponent;
  let fixture: ComponentFixture<MinistryConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryConfirmationComponent, BaseComponent, FoiValidComponent, AlertInfoComponent ],
      imports:[ReactiveFormsModule, FontAwesomeModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
