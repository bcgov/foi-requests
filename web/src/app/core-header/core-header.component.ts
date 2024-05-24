import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent implements OnInit {

  serviceName = "Request records from the B.C. Government";
  constructor() { }

  ngOnInit() {
  }

}
