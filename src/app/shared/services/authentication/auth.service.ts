import {Injectable, NgZone} from '@angular/core';
import {Observable}         from 'rxjs';
import {AngularFireAuth}    from '@angular/fire/auth';
import {Router}             from '@angular/router';
import {map, shareReplay}   from 'rxjs/operators';
import * as firebase        from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private smallBatchDevsEmail = 'smallbatchdevs@gmail.com';

  public user$: Observable<any> = this.afAuth.user.pipe(shareReplay(1));

  constructor(private afAuth: AngularFireAuth, private router: Router, private ngZone: NgZone) {
    this.user$.subscribe();
  }

  signInWithGoogle() {
    return this.afAuth
      .signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
      .then((res) => {
        console.log('AuthService::Successful Google login', res);
        return this.ngZone.run(() => this.router.navigate(['/']));
      })
      .catch((err) => {
        console.log('AuthService::Failed Google login', err);
      });
  }

  signInWithGithub() {
    return this.afAuth
      .signInWithPopup(new firebase.default.auth.GithubAuthProvider())
      .then((res) => {
        console.log('AuthService::Successful Github login', res);
        return this.ngZone.run(() => this.router.navigate(['/']));
      })
      .catch((err) => {
        console.log('AuthService::Failed Github login', err);
      });
  }

  signInWithEmail(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
      console.log('AuthService::Successful Email login', res);
      return this.ngZone.run(() => this.router.navigate(['/']));
    });
  }

  signUpWithEmail(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  isSmallBatchDevsLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(map(user => user && user.email === this.smallBatchDevsEmail));
  }

  logout() {
    this.afAuth.signOut().then(this.router.navigate['/']);
  }

  // Not Yet Implemented
  signInWithTwitter() {
    return this.afAuth
      .signInWithPopup(new firebase.default.auth.TwitterAuthProvider())
      .then((res) => {
        console.log('AuthService::Successful Twitter login', res);
        return this.ngZone.run(() => this.router.navigate(['/']));
      })
      .catch((err) => {
        console.log('AuthService::Failed Twitter login', err);
      });
  }

  // Not Yet Implemented
  signInWithFacebook() {
    return this.afAuth
      .signInWithPopup(new firebase.default.auth.FacebookAuthProvider())
      .then((res) => {
        console.log('AuthService::Successful Facebook login', res);
        return this.ngZone.run(() => this.router.navigate(['/']));
      })
      .catch((err) => {
        console.log('AuthService::Failed Facebook login', err);
      });
  }
}
