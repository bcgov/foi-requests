import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoiFileinputComponent } from './foi-fileinput.component';

describe('FoiFileinputComponent', () => {
  let component: FoiFileinputComponent;
  let fixture: ComponentFixture<FoiFileinputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoiFileinputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoiFileinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
