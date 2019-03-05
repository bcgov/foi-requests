import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryConfirmationComponent } from './ministry-confirmation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MockDataService, MockRouter } from '../../MockClasses';
import { UtilsComponentsModule } from 'src/app/utils-components/utils-components.module';


describe('MinistryConfirmationComponent', () => {
  let component: MinistryConfirmationComponent;
  let fixture: ComponentFixture<MinistryConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryConfirmationComponent ],
      imports:[ReactiveFormsModule, UtilsComponentsModule],
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
