import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  error : any;

  constructor(private db : AngularFireDatabase, private af: AngularFireAuth, private router:Router) { }

  signup(form){
    console.log("in signup "+ form.email);
    this.af.auth.createUserWithEmailAndPassword(form.email, form.password)
    .then (()=> {
      this.router.navigate ([('/scanner')]);
    })
    .catch ((err) =>{
      console.log(err);
      this.error = err;
    })
  }

}
