import {Component} from '@angular/core';
import {FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult} from 'firebaseui-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-firebaseui-login',
  templateUrl: './firebaseui-login.component.html',
  styleUrls: ['./firebaseui-login.component.scss']
})
export class FirebaseuiLoginComponent {

  errorMessage = '';

  constructor(private router: Router) {}

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.errorMessage = '';
    console.log('Firebase UI Login successCallback function', signInSuccessData);
    this.router.navigate(['']);
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log('Firebase UI Login errorCallback function', errorData);
    this.errorMessage = 'Error logging in!';
  }

}
