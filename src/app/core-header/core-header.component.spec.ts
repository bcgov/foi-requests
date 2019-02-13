import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreHeaderComponent } from './core-header.component';

describe('CoreHeaderComponent', () => {
  let component: CoreHeaderComponent;
  let fixture: ComponentFixture<CoreHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
