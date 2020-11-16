import {Component, OnInit}                        from '@angular/core';
import {BlogPost}                                 from '../../../../shared/models/blog-post';
import {DatabaseService}                          from '../../../../shared/services/database/database.service';
import {Router}                                   from '@angular/router';
import {Observable}                               from 'rxjs';
import {AuthService}                              from '../../../../shared/services/authentication/auth.service';
import {filter, first, map, startWith, switchMap} from 'rxjs/operators';
import {Contact}                                  from '../../../../../../shared/models/contact';
import * as firebase                              from 'firebase/app';
import 'firebase/functions';
import {loadStripe}                               from '@stripe/stripe-js';
import {objectExists}                             from '../../../../shared/services/utilites/utilities.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  readonly isUserSmallBatchDevs$: Observable<boolean> = this.authService.isSmallBatchDevsLoggedIn$();

  readonly currentUser$ = this.authService.user$.pipe(filter(objectExists));

  readonly doesNotHaveSubs$: Observable<boolean> = this.currentUser$.pipe(
    filter(objectExists),
    switchMap((user) => {
      return new Promise<boolean>((resolve, reject) => {
        // had to update firebase.firestore() to firebase.default.firestore() (from stripe firebase extension docs)
        firebase.default
          .firestore()
          .collection('users')
          .doc(user.uid)
          .collection('subscriptions')
          .where('status', 'in', ['trialing', 'active'])
          .onSnapshot(async (snapshot) => {
            // In this implementation we only expect one active or trialing subscription to exist.
            // If we get anything back, it means this user has a subscription.
            const doc = snapshot.docs[0];
            console.log(doc.id, ' => ', doc.data()); // console log subscription info if you want to do anything with it
            resolve(true);
          });
      });
    }),
    startWith(false)
  );

  readonly posts$: Observable<BlogPost[]> = this.database.getPublishedPosts$();

  constructor(private database: DatabaseService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

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

  async sendToCheckout() {
    await this.currentUser$
      .pipe(
        map((user) => {
          // had to update firebase.firestore() to firebase.default.firestore() (from stripe firebase extension docs)
          return firebase.default
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('checkout_sessions')
            .add({
              price: '', // todo price Id from your products price in the Stripe Dashboard
              success_url: window.location.origin, // return user to this screen on successful purchase
              cancel_url: window.location.origin // return user to this screen on failed purchase
            })
            .then((docRef) => {
              // Wait for the checkoutSession to get attached by the extension
              docRef.onSnapshot(async (snap) => {
                const { error, sessionId } = snap.data();
                if (error) {
                  // Show an error to your customer and inspect
                  // your Cloud Function logs in the Firebase console.
                  alert(`An error occurred: ${error.message}`);
                }

                if (sessionId) {
                  // We have a session, let's redirect to Checkout
                  // Init Stripe
                  const stripe = await loadStripe(
                    '' // todo enter your public stripe key here
                  );
                  console.log(`redirecting`);
                  await stripe.redirectToCheckout({ sessionId });
                }
              });
            });
        }),
        first() // prevent any memory leaks
      )
      .toPromise();
  }

  async sendToCustomerPortal() {
    // had to update firebase.app().functions() to firebase.default.functions() and
    // removed the region from the functions call (from stripe firebase extension docs)
    const functionRef = firebase.default
      .functions()
      .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  }
}
