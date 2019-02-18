import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionTimeframeComponent } from './description-timeframe.component';

describe('DescriptionTimeframeComponent', () => {
  let component: DescriptionTimeframeComponent;
  let fixture: ComponentFixture<DescriptionTimeframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionTimeframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionTimeframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
