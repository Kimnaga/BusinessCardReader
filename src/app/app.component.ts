import { Component } from '@angular/core';
import {LoginService} from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'searchApp';

  constructor(private service : LoginService) { 
  }


  logout(){
    this.service.signOut();
  }

  isLoggedIn():boolean{
    return this.service.isLoggedIn();
  }
}
