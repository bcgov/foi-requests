import { Component, OnInit } from '@angular/core';
import { TransomApiClientService } from '../transom-api-client.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(){

  }

  ngOnInit() {
  }

  doClick(){
    console.log("Here we go");
    // this.apiclient.ping().subscribe(value => {
    //   console.log("value:", value);
    // })
  }

}
