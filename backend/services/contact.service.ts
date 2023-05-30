import { Request, Response } from 'express';
import * as Sender from '../utils/email.connector';
import jwt from 'jsonwebtoken';

/**
 * A service class for handling contact-related operations.
 */
class ContactService {

    /**
     * Sends an email with the contact information.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async sendEmail(req: Request, res: Response) {
        const { name, email, message } = req.body;
        try {
            // Send email to support
            await Sender.sendEmail('atchison2014@gmail.com', 'Support Request', `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
            // Send acknowledgment email to the sender
            await Sender.sendEmail(email, 'Support Request', `Thank you for contacting us. We will get back to you as soon as possible.`);

            res.status(200).json({ message: 'Email sent' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Send an email to the user saying that their payment was unsuccessful.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async sendPaymentFailure(req: Request, res: Response) {
        const { email } = req.body;
        try {
            // Send acknowledgment email to the sender
            await Sender.sendEmail(email, 'Booking', `Unfortunately, your payment has failed. Please contact us for more information.`);

            res.status(200).json({ message: 'Email sent' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Sends a password reset email.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async sendResetPasswordEmail(req: Request, res: Response) {
        const { email } = req.body;
        try {
            // Generate a reset password token
            const payload = { email };
            const secret = process.env.JWT_SECRET || 'secret';
            const options = { expiresIn: '1h' };
            const token = jwt.sign(payload, secret, options);

            // Send the reset password email
            await Sender.sendEmail(email, 'Reset Password', `Click here to reset your password: http://localhost:3000/account/reset-password?token=${token}&email=${email}`);

            res.status(200).json({
                message: 'Email sent',
                token: token
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default ContactService;