import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "foi-fileinput",
  templateUrl: "./foi-fileinput.component.html",
  styleUrls: ["./foi-fileinput.component.scss"],
})
export class FoiFileinputComponent implements OnInit {
  // filename: string = "None";
  @ViewChild('fileinput') fileInput: ElementRef;
  @Output() fileselected = new EventEmitter<File>();
  @Input('filename') filename: string = "None";
  constructor() {}

  ngOnInit() {}

  selectFile(){
    console.log("select the file");
    this.fileInput.nativeElement.click()
    return false;
  }

  fileChange(event){
    const f: File = event.target.files[0];
    this.filename = f.name;
    this.fileselected.emit(f);
  }
}
