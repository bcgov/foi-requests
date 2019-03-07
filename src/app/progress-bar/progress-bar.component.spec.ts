import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProgressBarComponent } from "./progress-bar.component";

describe("ProgressBarComponent", () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show the progressbar segments", () => {
    const domElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(domElement.querySelectorAll("li").length).toBe(4);

    component.progressBarList = [{ route: "Test Segment", progress: 2 }];
    fixture.detectChanges();
    expect(domElement.querySelectorAll("li").length).toBe(1);
  });

  it("should check initial state and progressbar status on progress = 2", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    // Initial state and contains text
    for (let i = 0; i < segments.length; i++) {
      expect(segments[i].querySelector("div").className).toBe("inactive");
      expect(segments[i].innerText).toContain(`${i + 1}.`);
    }
    component.currentProgress = 2;
    fixture.detectChanges();

    expect(segments[0].querySelector("div").className).toBe("was-active");
    expect(segments[1].querySelector("div").className).toBe("active");
    expect(segments[2].querySelector("div").className).toBe("inactive");
    expect(segments[3].querySelector("div").className).toBe("inactive");
  });

  it("should update progressbar status on progress = 4", () => {
    const domElement = fixture.debugElement.nativeElement;
    const segments = domElement.querySelectorAll("li");

    component.currentProgress = 4;
    fixture.detectChanges();

    expect(segments[0].querySelector("div").className).toBe("was-active");
    expect(segments[1].querySelector("div").className).toBe("was-active");
    expect(segments[2].querySelector("div").className).toBe("was-active");
    expect(segments[3].querySelector("div").className).toBe("active");
  });

});
