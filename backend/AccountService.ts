import { Request, Response } from 'express';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { sendEmail } from './email-service';
import { getConnection } from './database';
import { PoolConnection, RowDataPacket, OkPacket } from 'mysql2/promise';
import { randomUUID } from 'crypto';

import config from './config';
import corporate from './modules/corporate';
import sessions from './modules/sessions';



import Corporate from './modules/corporate';
import User from './modules/user';

export default class AccountService {

    static async registerCorporate(req: Request, res: Response) {
        try {
            const { buisnessName, email, telephone, password, confirmPassword } = req.body;

            // check if passwords match
            if (password !== confirmPassword) {
                res.status(400).json({
                    message: 'Passwords do not match',
                });
                return;
            }

            // hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            const roleID = 2; // role is always 2 (corporate)

            // check if email already exists
            const corporate = new Corporate('', '', '', roleID, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (existingCorporate !== null) {
                res.status(409).json({
                    message: 'Email already exists',
                });
                return;
            }

            // get a connection from the pool
            const connection = await getConnection() as PoolConnection;

            // Try and query the database
            try {
                // Create a new corporate
                const corporate = await new Corporate(buisnessName, email, hashedPassword, roleID, telephone, undefined);
                corporate.save();

                // Send email
                sendEmail(email, 'Welcome to ParkEasy', 'Thank you for registering with us!');

                // Send response
                res.status(200).json({
                    message: 'Corporate account created',
                });
            } catch (error) {
                // Rollback the transaction
                await connection.rollback();
                res.status(500).json({ message: 'Internal Server Error' });
            } finally {
                // Release the connection
                connection.release();
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async registerUser(req: Request, res: Response) {
        try {
            const { forename, surname, email, telephone, password, confirmPassword } = req.body;

            // check if passwords match
            if (password !== confirmPassword) {
                res.status(400).json({
                    message: 'Passwords do not match',
                });
                return;
            }

            // hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            const roleID = 1; // role is always 1 (user)

            // check if email already exists
            const user = await new User('', '', '', '', roleID, '', 0);
            const existingUser = await user.findByEmail(email);

            if (existingUser !== null) {
                res.status(409).json({
                    message: 'Email already exists',
                });
                return;
            }

            // get a connection from the pool
            const connection = await getConnection() as PoolConnection;

            // Try and query the database
            try {
                // Create a new user
                const user = new User(forename, surname, email, hashedPassword, roleID, telephone, undefined);
                user.save();

                // Send response
                res.status(200).json({
                    message: 'User account created',
                });
            } catch (error) {
                // Rollback the transaction
                await connection.rollback();
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            } finally {
                // Release the connection
                connection.release();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
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
     * @deprecated
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

    static async login(req: Request, res: Response) {
        try {
            const { email, password, rememberMe } = req.body;


            // Check account type
            const user = new User('', '', '', '', 0, '', 0);
            const existingUser = await user.findByEmail(email);

            const corporate = new Corporate('', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (existingUser == null && existingCorporate == null) {
                res.status(404).json({
                    message: 'Account not found',
                });
                return;
            }

            // Check if password is correct
            const isPasswordCorrect = compareSync(password, existingUser ? existingUser.password : existingCorporate ? existingCorporate.password : '');

            if (!isPasswordCorrect) {
                res.status(401).json({
                    message: 'Incorrect password',
                });
                return;
            }

            // Expire time
            const expireTime = rememberMe ? 7 * 24 * 60 * 60 : 60 * 60;
            // Generate JWT token
            const token = await sessions.generateToken(email, expireTime);

            // create session
            sessions.createSession(email, token, expireTime);

            // Send response
            res.status(200).json({
                message: 'Login successful',
                access_token: token,
                expires: expireTime,
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const { access_token } = req.body;

            // Check if token is valid
            const decoded = await sessions.verifyToken(access_token);

            if (!decoded) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Delete session
            sessions.deleteSession(access_token);

            // Send response
            res.status(200).json({
                message: 'Logout successful',
            });

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            // Check account type
            const user = new User('', '', '', '', 0, '', 0);
            const existingUser = await user.findByEmail(email);

            const corporate = new Corporate('', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (existingUser == null && existingCorporate == null) {
                res.status(404).json({
                    message: 'Account not found',
                });
                return;
            }

            // Generate token
            const token = await sessions.generateToken(email, 60 * 60);
            // Create link
            const link = `http://localhost:3000/account/reset-password?token=${token}`;

            // Send email
            await sendEmail(email, 'Reset Password', `Click the link below to reset your password: ${link}`);

            // Send response
            res.status(200).json({
                message: 'Email sent',
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token, password, confirmPassword } = req.body;

            // Check if token is valid
            const decoded = await sessions.verifyToken(token);

            if (!decoded) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Check if password and confirm password match
            if (password !== confirmPassword) {
                res.status(400).json({
                    message: 'Passwords do not match',
                });
                return;
            }

            // Get email from token
            const email = await sessions.getEmail(token);
            if (!email) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Check account type
            const user = new User('', '', '', '', 0, '', 0);
            const existingUser = await user.findByEmail(email);

            const corporate = new Corporate('', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (existingUser == null && existingCorporate == null) {
                res.status(404).json({
                    message: 'Account not found',
                });
                return;
            }

            // Hash password
            const hashedPassword = hashSync(password, 10);
            
            // Update password
            if (existingUser) {
                await user.updatePassword(hashedPassword);
            } else {
                await corporate.updatePassword(hashedPassword);
            }

            // Delete session
            sessions.deleteSession(token);

            // Send response
            res.status(200).json({
                message: 'Password reset successful',
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async deleteAccount(req: Request, res: Response) {
        try {
            const { access_token } = req.body;

            // Check if token is valid
            const decoded = await sessions.verifyToken(access_token);

            if (!decoded) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Get email from token
            const email = await sessions.getEmail(access_token);
            if (!email) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Check account type
            const user = new User('', '', '', '', 0, '', 0);
            const existingUser = await user.findByEmail(email);

            const corporate = new Corporate('', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (existingUser == null && existingCorporate == null) {
                res.status(404).json({
                    message: 'Account not found',
                });
                return;
            }

            // Delete account
            if (existingUser) {
                await user.delete();
            } else {
                await corporate.delete();
            }

            // Delete session
            sessions.deleteSession(access_token);

            // Send response
            res.status(200).json({
                message: 'Account deleted',
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async findUser(req: Request, res: Response) {
        try {
            const { access_token } = req.body;

            // Check if token is valid
            const decoded = await sessions.verifyToken(access_token);

            if (!decoded) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Get email from token
            const email = await sessions.getEmail(access_token);
            if (!email) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Check account type
            const user = new User('', '', '', '', 0, '', 0);
            const existingUser = await user.findByEmail(email);

            const corporate = new Corporate('', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (existingUser == null && existingCorporate == null) {
                res.status(404).json({
                    message: 'Account not found',
                });
                return;
            }

            // Send response
            if (existingUser)   {
                res.status(200).json({
                    message: 'User account found',
                    user: existingUser,
                    isCorporateUser: false,
                });
            } else {
                res.status(200).json({
                    message: 'Corporate account found',
                    user: existingCorporate,
                    isCorporateUser: true,
                });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


    static async contact(req: Request, res: Response) {
        // get data from request
        const { name, email, message } = req.body;

        // send email
        try {
            await sendEmail('atchison2014@gmail.com', 'Support Request', `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
            await sendEmail(email, 'Support Request', `Thank you for contacting us. We will get back to you as soon as possible.`);

            res.status(200).json({
                message: 'Your message has been sent.'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Something went wrong'
            });
            return;
        }
    }

}