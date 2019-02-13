import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitDemoComponent } from './review-submit-demo.component';

describe('ReviewSubmitDemoComponent', () => {
  let component: ReviewSubmitDemoComponent;
  let fixture: ComponentFixture<ReviewSubmitDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewSubmitDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmitDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
