import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitCompleteComponent } from './review-submit-complete.component';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { DataService } from 'src/app/services/data.service';
import { MockDataService, MockRouter } from '../../MockClasses';
import { Router } from '@angular/router';

describe('ReviewSubmitCompleteComponent', () => {
  let component: ReviewSubmitCompleteComponent;
  let fixture: ComponentFixture<ReviewSubmitCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewSubmitCompleteComponent, BaseComponent ],
      providers: [
        {provide: DataService, useClass: MockDataService},
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmitCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
