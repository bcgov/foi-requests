import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTopicComponent } from './request-topic.component';

describe('RequestTopicComponent', () => {
  let component: RequestTopicComponent;
  let fixture: ComponentFixture<RequestTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
