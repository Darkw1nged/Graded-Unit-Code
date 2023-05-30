"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mailgun = new mailgun_js_1.default({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});
/**
 * Sends an email using Mailgun.
 * @param {string} recipient - The email recipient.
 * @param {string} subject - The email subject.
 * @param {string} body - The email body.
 * @param {Function} [callback] - Optional callback function to handle the response.
 * @param {Function} [errorCallback] - Optional callback function to handle errors.
 */
function sendEmail(recipient, subject, body, callback, errorCallback) {
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
        }
        else {
            if (callback) {
                callback(body);
            }
        }
    });
}
exports.sendEmail = sendEmail;
