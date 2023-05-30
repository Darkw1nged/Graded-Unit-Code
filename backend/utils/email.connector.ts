import Mailgun from 'mailgun-js';
import dotenv from 'dotenv';

dotenv.config();

const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string
});

/**
 * Sends an email using Mailgun.
 * @param {string} recipient - The email recipient.
 * @param {string} subject - The email subject.
 * @param {string} body - The email body.
 * @param {Function} [callback] - Optional callback function to handle the response.
 * @param {Function} [errorCallback] - Optional callback function to handle errors.
 */
export function sendEmail(recipient: string, subject: string, body: string, callback?: (response: any) => void, errorCallback?: (error: any) => void) {
    const data = {
        from: 'noreply@' + process.env.MAILGUN_DOMAIN,
        to: recipient,
        subject,
        text: body,
    };

    mailgun.messages().send(data, (error, body) => {
        if (error) {
            console.error(error);
            if (errorCallback) {
                errorCallback(error);
            }
        } else {
            if (callback) {
                callback(body);
            }
        }
    });
}