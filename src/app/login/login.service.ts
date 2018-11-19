import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  error : any;
  signIn : boolean;
  private currentUser : firebase.User = null;
  private authState : Observable <firebase.User>;

  constructor(private db : AngularFireDatabase, private af: AngularFireAuth, private router:Router) { 
    this.authState = this.af.authState;
    this.authState.subscribe(user =>{
      if (user){
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  getCurrentUser () {
    return this.currentUser;
  }

  loginWithEmail (loginForm){
      this.af.auth.signInWithEmailAndPassword(loginForm.email, loginForm.password)
        .then ((auth) =>{
          const createdAt = firebase.database.ServerValue.TIMESTAMP;
          const sessionKey = this.db.database
                        .ref(`sessions`)
                        .push({
                          userUid: auth.user.uid
                        }).key;

        const sessionPayload: any = {
          createdAt: createdAt,
          userUid: auth.user.uid,
          currentSessionKey: sessionKey,
        };

        const sessionPayloads: any = {};
        sessionPayloads[`currentSession/${auth.user.uid}`] = sessionPayload;
        sessionPayloads[`users/${auth.user.uid}/sessions/${sessionKey}`] = {'createdAt': createdAt};
        
        this.router.navigate([('/scanner')]);
        this.signIn = true;
        return this.db.database.ref().update(sessionPayloads);
        })
        .catch ((err)=>{
          this.error = err;
        })
    }

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


    
    signOut(){
      this.af.auth.signOut();
      this.router.navigate(['/']);
    }

    isLoggedIn (){
      if (this.currentUser== null){
        return false;
      }
      return true;
    }
}
