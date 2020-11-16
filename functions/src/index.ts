// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

import { sendEmail } from './email';
import { generateSitemap } from './sitemap';
import { createCheckoutSession } from './stripe';

export { sendEmail, generateSitemap, createCheckoutSession };
