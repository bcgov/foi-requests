import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { FooterComponent } from "./footer.component";

describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should hide the Bootstrap UI size on a prodction build", () => {
    const footer = fixture.debugElement.componentInstance;
    const domElement = fixture.debugElement.nativeElement;

    // Simulate running a Development build
    footer.environment.production = false;
    fixture.detectChanges();
    expect(domElement.querySelectorAll("li").length).toBe(5);

    // Simulate running a Production build
    footer.environment.production = true;
    fixture.detectChanges();
    expect(domElement.querySelectorAll("li").length).toBe(4);
  });
});
