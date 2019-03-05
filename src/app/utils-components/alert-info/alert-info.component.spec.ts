import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertInfoComponent } from './alert-info.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('AlertInfoComponent', () => {
  let component: AlertInfoComponent;
  let fixture: ComponentFixture<AlertInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertInfoComponent ],
      imports: [FontAwesomeModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
