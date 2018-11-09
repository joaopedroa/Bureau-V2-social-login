import { Injectable } from '@angular/core';

import { AngularFireList  } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import {User} from '../user'

/*
  Generated class for the ServicesProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesProvider {

  userRef: AngularFireList<any>;

  constructor(private afAuth: AngularFireAuth) {
    console.log('Hello ServicesProvider Provider');
  }

  emailLogin(user:User) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
       
  }

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously();
  }

  signOut(): void {
    this.afAuth.auth.signOut();   
  }

  createUser(user: User) {
    return this.afAuth
      .auth
      .createUserWithEmailAndPassword(user.email, user.password);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
    
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider);
  
  }
  resetPassword(email:string){
    return this.afAuth.auth.sendPasswordResetEmail(email);
    
  }

}