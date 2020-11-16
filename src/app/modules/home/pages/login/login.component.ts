import { Component } from '@angular/core';
import {AuthService} from '../../../../shared/services/authentication/auth.service';

interface EmailPassword {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  emailEnabled = false;
  userEmail = '';
  userPassword = '';
  errorMessage = '';

  googleLogin() {
    this.authService.signInWithGoogle().then(res => {
      console.log('LoginComponent:: successful login');
    });
  }

  githubLogin() {
    this.authService.signInWithGithub().then(res => {
      console.log('LoginComponent:: successful login');
    });
  }

  emailPasswordLogin() {
    if (this.userEmail && this.userPassword) {
      this.authService.signInWithEmail(this.userEmail, this.userPassword).then(res => {
        console.log('LoginComponent:: emailPasswordLogin:: successful login', res);
      }).catch((err) => {
        console.log('LoginComponent:: emailPasswordLogin:: login failed:', err);
      });
    }
  }

  emailPasswordSignUp() {
    if (this.userEmail && this.userPassword) {
      this.authService.signUpWithEmail(this.userEmail, this.userPassword).then(res => {
        console.log('LoginComponent:: successful login', res);
      }).catch((err) => {
        console.log('LoginComponent:: emailPasswordSignUp:: sign up failed:', err);
      });
    }
  }

  // Not Yet Implemented
  twitterLogin() {
    this.authService.signInWithTwitter().then(res => {
      console.log('LoginComponent:: successful login');
    });
  }

  // Not Yet Implemented
  facebookLogin() {
    this.authService.signInWithFacebook().then(res => {
      console.log('LoginComponent:: successful login');
    });
  }
}
