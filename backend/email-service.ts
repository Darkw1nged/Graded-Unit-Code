import mailgun from "mailgun-js";

import dotenv from 'dotenv';
dotenv.config();

class MailgunEmailService {
    private mailgun: mailgun.Mailgun;

    constructor(apiKey: string, domain: string) {
        this.mailgun = mailgun({
            apiKey: process.env.MAILGUN_API_KEY as string, 
            domain: process.env.MAILGUN_DOMAIN as string
        });
    }

    sendEmail(to: string, from: string, subject: string, html: string) {
        const data = {
            to,
            from,
            subject,
            html,
        };
        this.mailgun.messages().send(data, function (error, body) {
        if (error) {
            console.error(error);
        }
        });
    }
}

export default MailgunEmailService;