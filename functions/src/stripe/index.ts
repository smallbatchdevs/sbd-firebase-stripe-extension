import * as functions from 'firebase-functions';

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(''); // enter your secret stripe key here. WARNING DO NOT PUBLISH THIS TO ANY PUBLIC REPO. DO NOT SHARE THIS KEY

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { product_name, unit_amount, quantity } = data;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product_name
          },
          unit_amount: unit_amount * 100 // $5.00 must be 500
        },
        quantity
      }
    ],
    mode: 'payment',
    success_url: 'https://example.com?' + // todo enter your success url
                 'session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com' //todo enter your cancel URL
  });
  return session.id;
});
