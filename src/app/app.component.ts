import {Component}   from '@angular/core';
import {AuthService} from './shared/services/authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Dependency Inject our auth service here so it initializes before AuthGuard
  constructor(private auth: AuthService) {}
}
