import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStarted1Component } from './getting-started1.component';

describe('GettingStarted1Component', () => {
  let component: GettingStarted1Component;
  let fixture: ComponentFixture<GettingStarted1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingStarted1Component ]
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
