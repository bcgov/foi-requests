import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptiveParentsComponent } from './adoptive-parents.component';

describe('AdoptiveParentsComponent', () => {
  let component: AdoptiveParentsComponent;
  let fixture: ComponentFixture<AdoptiveParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdoptiveParentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdoptiveParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
