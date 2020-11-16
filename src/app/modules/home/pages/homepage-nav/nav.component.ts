import {Component} from '@angular/core';
import {AuthService} from '../../../../shared/services/authentication/auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  currentUser$: Observable<string> = this.authService.user$.pipe(
    map((user) => user ? user.email : null)
  );

  constructor(private authService: AuthService) {
  }

  logoutUser() {
    this.authService.logout();
  }
}
