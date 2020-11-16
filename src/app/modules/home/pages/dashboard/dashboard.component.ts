import {Component}       from '@angular/core';
import {Observable}      from 'rxjs';
import {BlogPost}        from '../../../../shared/models/blog-post';
import {filter}          from 'rxjs/operators';
import {objectExists}    from '../../../../shared/services/utilites/utilities.service';
import {DatabaseService} from '../../../../shared/services/database/database.service';
import {Router}          from '@angular/router';
import {AuthService}     from '../../../../shared/services/authentication/auth.service';
import {Contact}         from '../../../../../../shared/models/contact';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  readonly blogs$: Observable<BlogPost[]> = this.database.getPosts$();

  isUserSmallBatchDevs$: Observable<boolean> = this.authService.isSmallBatchDevsLoggedIn$();

  currentUser$ = this.authService.user$.pipe(filter(objectExists));

  constructor(private database: DatabaseService, private router: Router, private authService: AuthService) {}

  editPost(postUid?: string) {
    if (postUid) {
      this.router.navigate([`/edit/${postUid}`]);
    } else {
      this.router.navigate([`/edit/${this.database.getNewUid()}`]);
    }
  }

  readPost(postUid: string) {
    this.router.navigate([`/post/${postUid}`]);
  }

  addContactToDatabase(email, firstName) {
    const contact: Contact = { email, firstName };
    // use email as the firebase document uid in case the user tries to sign up multiple times.
    // emails are safe to use as the uid as they are guaranteed to be unique.
    return this.database.set(contact, `contacts/${email}`);
  }

  logout() {
    this.authService.logout();
  }

  flipPublished(blog: BlogPost) {
    blog.isPublished = !blog.isPublished;
    this.database
      .updatePost(blog)
      .then(() => {
        // NOOP
      })
      .catch((error) => {
        // Set the boolean back on client to what it originally was if update fails
        blog.isPublished = !blog.isPublished;
        console.error('Error Occured while updating', error);
      });
  }

}
