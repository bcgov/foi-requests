import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {KeycloakService} from '../../services/keycloak.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private dataService: DataService, private keycloakService: KeycloakService, private router: Router) {}

  ngOnInit() {
    this.keycloakService.init().then((authenticated) => {
      if (authenticated) {
        this.dataService.saveShowBanner();
        this.router.navigateByUrl('personal/select-about');
      } else {
        this.dataService.saveShowEmailAlert();
        this.router.navigateByUrl('choose-identity');
      }
    });
  }

}
