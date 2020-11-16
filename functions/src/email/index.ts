import * as functions     from 'firebase-functions';
import {SENDGRID_API_KEY} from '../api_keys';

export const sendEmail = functions.firestore.document(`contacts/{documentUid}`).onCreate(async (event: any) => {
  console.log(`event `, event);
  const contact: any = event.data();
  const welcomeEmail: any = {
    to: contact.email,
    from: '', // todo your email here
    templateId: '',
    dynamic_template_data: {
      firstName: contact.firstName
    }
  };
  return sendgridSendEmail(welcomeEmail);
});

function sendgridSendEmail(data: any): Promise<void> {
  console.log(`Sending email with data: `, data);
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);
  return sgMail
    .send(data)
    .then((response: any[]) => console.log('Success sending email: ', response))
    .catch((error: any) => console.log('Error sending email: ', error));
}
