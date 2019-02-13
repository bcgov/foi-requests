import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDemo1Component } from './request-demo1.component';

describe('RequestDemo1Component', () => {
  let component: RequestDemo1Component;
  let fixture: ComponentFixture<RequestDemo1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDemo1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDemo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
