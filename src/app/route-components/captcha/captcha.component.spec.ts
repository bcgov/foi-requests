import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CaptchaComponent } from './captcha.component';
import { CaptchaDataService } from 'src/app/services/captcha-data.service';
import { of, Observable } from 'rxjs';

class MockCaptchaDataService{
  public fetchData(apiBaseUrl: string, nonce: string): Observable<any> {
    return of({foo:"bar"});
  }
}

describe('CaptchaComponent', () => {
  let component: CaptchaComponent;
  let fixture: ComponentFixture<CaptchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptchaComponent ],
      providers:[
        {provide: CaptchaDataService, useClass: MockCaptchaDataService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
