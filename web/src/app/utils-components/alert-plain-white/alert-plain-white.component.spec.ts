import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPlainWhiteComponent } from './alert-plain-white.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('AlertPlainWhiteComponent', () => {
  let component: AlertPlainWhiteComponent;
  let fixture: ComponentFixture<AlertPlainWhiteComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPlainWhiteComponent ],
      imports: [FontAwesomeModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPlainWhiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
