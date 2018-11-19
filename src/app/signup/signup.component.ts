import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignupService} from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm : FormGroup;
  error : any;
  constructor(private service : SignupService) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required)
    });
  }

  get f(){
    return this.signupForm.controls;
  }


  onSignup() : void{
    if (this.signupForm.valid){
      console.log("in signup ");
      this.service.signup (this.signupForm.value);
    } 
  }

}
