import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertWarningWhiteComponent } from './alert-warning-white.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('AlertWarningWhiteComponent', () => {
  let component: AlertWarningWhiteComponent;
  let fixture: ComponentFixture<AlertWarningWhiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertWarningWhiteComponent ],
      imports: [FontAwesomeModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertWarningWhiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
