import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAboutComponent } from './select-about.component';

describe('SelectAboutComponent', () => {
  let component: SelectAboutComponent;
  let fixture: ComponentFixture<SelectAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
