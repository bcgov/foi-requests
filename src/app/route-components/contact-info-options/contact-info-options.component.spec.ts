import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoOptionsComponent } from './contact-info-options.component';
import { FoiValidComponent } from 'src/app/foi-valid/foi-valid.component';
import { BaseComponent } from '../base/base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MockDataService, MockRouter } from '../MockClasses';
import { Router } from '@angular/router';

describe('ContactInfoOptionsComponent', () => {
  let component: ContactInfoOptionsComponent;
  let fixture: ComponentFixture<ContactInfoOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInfoOptionsComponent, BaseComponent, FoiValidComponent ],
      imports:[ReactiveFormsModule],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
