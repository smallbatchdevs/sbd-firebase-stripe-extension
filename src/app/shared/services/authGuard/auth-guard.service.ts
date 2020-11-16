import {Injectable}                   from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {AuthService}                  from '../authentication/auth.service';
import {map}                          from 'rxjs/operators';
import {Observable}                   from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isSmallBatchDevsLoggedIn$().pipe(map(isLoggedIn => isLoggedIn ? true : this.router.createUrlTree(['login'])));
  }
}
