import Mailgun from 'mailgun-js';
require('dotenv').config();

const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string
});

/**
 * Sends an email to the specified recipient.
 * @param recipient The recipient's email address.
 * @param subject The subject of the email.
 * @param body The body of the email.
 * @param callback The callback to execute when the email has been sent.
 * @param errorCallback The callback to execute if an error occurs.
 * @returns The response from Mailgun.
 * @throws 500 if the email could not be sent.
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