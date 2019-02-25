import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitCompleteComponent } from './review-submit-complete.component';

describe('ReviewSubmitCompleteComponent', () => {
  let component: ReviewSubmitCompleteComponent;
  let fixture: ComponentFixture<ReviewSubmitCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewSubmitCompleteComponent ]
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
