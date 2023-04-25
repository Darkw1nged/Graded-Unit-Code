import { Request, Response } from 'express';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { sendEmail } from './email-service';
import { getConnection } from './database';
import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { randomUUID } from 'crypto';

import config from './config';
import user from './modules/user';
import corporate from './modules/corporate';
import sessions from './modules/sessions';

/**
 * The account service.
 * @class AccountService
 * @module AccountService
 * @description The account service for handling requests from the frontend.
 */
class AccountService {

    /**
     * This compares the password that the user entered with the password that is stored in the database.
     * @memberof AccountService
     * @description This compares the password that the user entered with the password that is stored in the database.
     * @param email The email of the user or corportate.
     * @param password The password that the user entered.
     * @returns True if the password is correct, false if it is not.
     */
    static async comparePassword(email: string, password: string): Promise<boolean> {
        // Check if the user is a corporate or a personal user
        const corporateUser = await corporate.findByEmail(email);
        const personalUser = await user.findByEmail(email);

        // Check if there is an account with the given email
        if (!corporateUser && !personalUser) {
            return false;
        }

        // get a connection from the pool
        const connection = await getConnection() as PoolConnection; 

        // Get the password from the database
        let foundPassword;

        // Try and query the database
        try {
            // For corporate users
            if (corporateUser) {
                const [rows] = await connection.query<RowDataPacket[]>('SELECT password FROM corporate WHERE email = ?', [email]);
                
                // Check if an account with the given email exists
                if (rows.length === 0) {
                    return false;
                }

                // Check if the password is correct
                foundPassword = rows[0].password;
            } else if (personalUser) {
                const [rows] = await connection.query<RowDataPacket[]>('SELECT password FROM users WHERE email = ?', [email]);

                // Check if an account with the given email exists
                if (rows.length === 0) {
                    return false;
                }

                // Check if the password is correct
                foundPassword = rows[0].password;
            }
        } finally {
            // release the connection
            connection.release();
        }

        // Compare the password that the user entered with the password that is stored in the database
        return compareSync(password, foundPassword);
    }

    /**
     * Creates a new corporate account.
     *
     * @memberof AccountService
     * @param {Request} req The request.
     * @param {Response} res The response.
     * @returns {void}
     * @throws {Error} 409 if the email already exists.
     * @throws {Error} 500 if the corporate could not be created.
     */
    static async createCorporate(req: Request, res: Response): Promise<void> {
        try {
            // get data from request
            const { buisnessName, email, telephone, password, confirmPassword } = req.body;

            // check if passwords match
            if (password !== confirmPassword) {
                res.status(409).json({
                    message: 'Passwords do not match',
                    status: 'error'
                });
                return;
            }

            // hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            const roleID = 2; // role is always 2 (corporate)

            // check if email already exists
            const existingCorporate = await corporate.findByEmail(email);
            if (existingCorporate) {
                res.status(409).json({
                    message: 'An account with that email already exists',
                    status: 'error'
                });
                return;
            }

            // call create method to create corporate account
            await corporate.createCorporate(buisnessName, email, hashedPassword, roleID, telephone);

            // generate JWT token for the corporate account
            const token = sign({ id: randomUUID }, config.jwtSecret, { expiresIn: '1h' });

            // Send email to the corporate
            sendEmail(email, 'Welcome to ParkEasy', 'Thank you for registering with us!');

            // send response with the created corporate's details and JWT token
            res.status(201).json({
                message: 'Corporate account created successfully',
                access_token: token,
                status: 'success'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Something went wrong',
                status: 'error'
            });
        }
    }

    /**
     * Creates a new personal account.
     * @memberof AccountService
     * @description Creates a new personal account.
     * @param req The request.
     * @param res The response.
     * @returns The personal's details.
     * @throws 409 if the email already exists.
     * @throws 500 if the personal could not be created.
     */
    static async createPersonal(req: Request, res: Response) {
        try {
            // get data from request
            const { forename, surname, email, password, confirmPassword } = req.body;

            // check if passwords match
            if (password !== confirmPassword) {
                res.status(409).json({
                    message: 'Passwords do not match',
                    status: 'error'
                });
                return;
            }

            // hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            const roleID = 1; // role is always 1 (personal)

            // check if email already exists
            const existingPersonal = await user.findByEmail(email);
            if (existingPersonal) {
                res.status(409).json({
                    message: 'An account with that email already exists',
                    status: 'error'
                });
                return;
            }

            // call create method to create personal account
            await user.createPersonal(forename, surname, email, hashedPassword, roleID);

            // generate JWT token for the personal account
            const token = sign({ id: randomUUID }, config.jwtSecret, { expiresIn: '1h' });

            // send response with the created personal's details and JWT token
            res.status(201).json({
                message: 'Personal account created successfully',
                access_token: token,
                status: 'success'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Something went wrong',
                status: 'error'
            });
        }
    }

    /**
     * Creates a new personal account via external api.
     * @memberof AccountService
     * @description Creates a new personal account.
     * @param req The request.
     * @param res The response.
     * @returns The personal's details.
     * @throws 409 if the email already exists.
     * @throws 500 if the personal could not be created.
     */
    // static async createSocialAccount(req: Request, res: Response) {
    //     try {
    //         // get data from request
    //         const { forename, surname, email, provider } = req.body;

    //         console.log(provider);

    //         // check if user with the same email already exists
    //         const existingPersonal = await user.findByEmail(email);
    //         if (existingPersonal) {
    //             res.status(409).json({ message: 'An account with that email already exists' });
    //             return;
    //         }

    //         // call external api to create social account
    //         await user.createPersonal(forename, surname, email, '', 1);

    //         // generate JWT token for the personal account
    //         const token = sign({ id: randomUUID }, config.jwtSecret, { expiresIn: '1h' });

    //         // create a token
    //         const resetToken = sessions.generateToken(email, 60 * 60);
    //         // create a link
    //         const link = `/reset-password?token=${resetToken}`;

    //         // send response with the created personal's details and JWT token
    //         res.status(201).json({
    //             message: 'Personal account created successfully',
    //             access_token: token,
    //             redirectUrl: link
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Something went wrong' });
    //     }
    // }


    /**
     * Logs a user in (corporate included).
     * @memberof AccountService
     * @description Logs a user in (corporate included).
     * @param req The request.
     * @param res The response.
     * @returns The user's token.
     * @throws 404 if the email does not exist.
     * @throws 401 if the password is incorrect.
     * @throws 500 if the user could not be logged in.
     */
    static async login(req: Request, res: Response) {
        // get data from request
        const { email, password, rememberMe } = req.body;

        // Check if the user is a corporate or a personal user
        const corporateUser = await corporate.findByEmail(email);
        const personalUser = await user.findByEmail(email);

        // Check if there is an account with the given email
        if (!corporateUser && !personalUser) {
            res.status(404).json({
                message: 'Email does not exist',
                status: 'error'
            });
            return;
        }

        // Check if the password is correct
        let isPasswordCorrect = await AccountService.comparePassword(email, password);

        if (!isPasswordCorrect) {
            res.status(401).json({
                message: 'Password is incorrect',
                status: 'error'
            });
            return;
        }

        // Get how long the token should last
        const expiresIn = rememberMe ?  30 * 24 * 60 * 60 : 60 * 60;
        // Create the token
        const secret = await sessions.generateToken(email, expiresIn);

        // start session
        sessions.createSession(email, secret, expiresIn);

        // Send the token
        try {
            res.status(200).json({
                message: 'Login successful',
                access_token: secret,
                expiresIn,
                status: 'success'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Something went wrong',
                status: 'error'
            });
        }
    }

    /**
     * Logs a user out.
     * @memberof AccountService
     * @description Logs a user out.
     * @param req The request.
     * @param res The response.
     * @returns The user's token.
     */
    static async logout(req: Request, res: Response) {
        // get data from request
        const { userToken } = req.body;

        // delete session
        await sessions.deleteSession(userToken);
        
        res.status(200).json({
            message: 'Logout successful'
        });
    }

    /**
     * Sends a password reset email.
     * @memberof AccountService
     * @description Sends a password reset email.
     * @param req The request.
     * @param res The response.
     * @returns The user's token.
     * @throws 404 if the email does not exist.
     * @throws 500 if the email could not be sent.
     */
    static async forgotPassword(req: Request, res: Response) {
        // get data from request
        const { email } = req.body;

        // Check if the user is a corporate or a personal user
        const corporateUser = await corporate.findByEmail(email);
        const personalUser = await user.findByEmail(email);

        // Check if there is an account with the given email
        if (!corporateUser && !personalUser) {
            res.status(404).json({
                message: 'Email does not exist',
                status: 'error'
            });
            return;
        }

        // create a token
        const token = await sessions.generateToken(email, 60 * 60);
        // create a link
        const link = `http://localhost:3000/account/reset-password?token=${token}`;

        // send email
        try {
            await sendEmail(email, 'Password Reset', `Click the link to reset your password: ${await link}`);
        
            res.status(200).json({
                message: 'A password reset email has been sent',
                status: 'success'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Something went wrong',
                status: 'error'
            });
            return;
        }

        res.status(200).json({
            message: 'Email sent'
        });
    }

    /**
     * Resets a user's password.
     * @memberof AccountService
     * @description Resets a user's password.
     * @param req The request.
     * @param res The response.
     * @throws 404 if the email does not exist.
     * @throws 401 if the token is invalid.
     * @throws 409 if the passwords do not match.
     * @throws 500 if the password could not be updated.
     * @returns The user's token.
     */
    static async resetPassword(req: Request, res: Response) {
        // get data from request
        const { password, confirmPassword, token } = req.body;
        
        // check if passwords match
        if (password !== confirmPassword) {
            res.status(409).json({
                message: 'Passwords do not match',
                status: 'error'
            });
            return;
        }

        // check if token is valid
        const isTokenValid = await sessions.verifyToken(token);

        // check if token is valid
        if (!isTokenValid) {
            res.status(401).json({
                message: 'Token is invalid',
                status: 'error'
            });
            return;
        }

        // get email from token
        const email = await sessions.getEmail(token);
        if (!email) {
            res.status(401).json({
                message: 'Token is invalid',
                status: 'error'
            });
            return;
        }

        // Check if the user is a corporate or a personal user
        const corporateUser = await corporate.findByEmail(email);
        const personalUser = await user.findByEmail(email);

        // Check if there is an account with the given email
        if (!corporateUser && !personalUser) {
            res.status(404).json({
                message: 'Email does not exist',
                status: 'error'
            });
            return;
        }

        // get a connection from the pool
        const connection = await getConnection() as PoolConnection; 
        
        // hash password
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);

        // Try and query the database
        try {
            // For corporate users
            if (corporateUser) {
                await connection.query('UPDATE corporate SET password = ? WHERE email = ?', [hashedPassword, email]);
            } else if (personalUser) {
                await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
            }

            // Delete the token
            await sessions.deleteToken(token);
        } finally {
            // release the connection
            connection.release();
        }

        res.status(200).json({
            message: 'Password reset successful',
            status: 'success'
        });
    }

    /**
     * Contacts the support team.
     * @memberof AccountService
     * @description Contacts the support team.
     * @param req The request.
     * @param res The response.
     * @throws 500 if the email could not be sent.
     */
    static async contact(req: Request, res: Response) {
        // get data from request
        const { name, email, message } = req.body;

        // send email
        try {
            await sendEmail('atchison2014@gmail.com', 'Support Request', `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
            await sendEmail(email, 'Support Request', `Thank you for contacting us. We will get back to you as soon as possible.`);

            res.status(200).json({
                message: 'Your message has been sent.',
                status: 'sent'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Something went wrong',
                status: 'failed'
            });
            return;
        }
    }

}

export default AccountService;