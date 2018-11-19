import { Component, OnInit } from '@angular/core';
import {LoginService} from './login.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;

  constructor(private service : LoginService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  get f(){
    return this.loginForm.controls;
  }

  onLoginEmail () : void{
    if (this.loginForm.valid){
      this.service.loginWithEmail (this.loginForm.value);
    } 
  }

  onSignup () : void{
    if (this.loginForm.valid){
      console.log("in signup ");
      this.service.signup (this.loginForm.value);
    } 
  }

}
