import {Component}            from '@angular/core';
import {loadStripe}           from '@stripe/stripe-js';
import {AngularFireFunctions} from '@angular/fire/functions';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent {
  stripe;
  donationAmount = 5.00;
  isGettingCheckout = false;

  constructor(private fns: AngularFireFunctions) {}

  async donate() {
    this.isGettingCheckout = true;
    this.stripe = await loadStripe(
      '' // your stripe public key here
    );
    const createCheckoutSession = this.fns.httpsCallable('createCheckoutSession');
    createCheckoutSession({
      product_name: 'Glass of Whiskey',
      quantity: 1,
      unit_amount: this.donationAmount
    })
      .toPromise()
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as argument here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      .then((sessionId: string) => this.stripe.redirectToCheckout({sessionId}))
      .catch((e) => console.log('Error Buying a glass of whiskey', e))
      .finally(() => this.isGettingCheckout = false);
  }
}
