import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoiValidComponent } from './foi-valid.component';

describe('FoiValidComponent', () => {
  let component: FoiValidComponent;
  let fixture: ComponentFixture<FoiValidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoiValidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoiValidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
