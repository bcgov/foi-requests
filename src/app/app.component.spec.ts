import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CoreHeaderComponent } from './core-header/core-header.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageService } from 'ngx-webstorage';

class MockLocalStorage{

}

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule
      ],
      declarations: [
        AppComponent, CoreHeaderComponent, ProgressBarComponent
      ],
      providers:[
        {provide: LocalStorageService, useClass: MockLocalStorage}
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
