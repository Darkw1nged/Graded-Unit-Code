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

            if (existingCorporate) {
                res.status(409).json({
                    message: 'Email already exists',
                });
                return;
            }

            // get a connection from the pool
            const connection = await getConnection() as PoolConnection;

            // Try and query the database
            try {
                // Start a transaction
                await connection.beginTransaction();
            
                // Insert the address into the database
                const [addressResult] = await connection.query<OkPacket>('INSERT INTO address (addressLine1, addressLine2, city, postcode) VALUES (?, ?, ?, ?)', [req.body.addressLine1, req.body.addressLine2, req.body.city, req.body.postcode]);
                const addressID = addressResult.insertId;

                // Insert the corporate into the database
                await connection.query(
                    'INSERT INTO corporate (buisnessName, email, password, roleID, telephone, addressID) VALUES (?, ?, ?, ?, ?, ?);',
                    [buisnessName, email, hashedPassword, roleID, telephone, addressID]
                );

                // Commit the transaction
                await connection.commit();

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
            const { firstName, lastName, email, telephone, password, confirmPassword } = req.body;

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
            const user = new User('', '', '', '', roleID, '', 0);
            const existingUser = await user.findByEmail(email);

            if (existingUser) {
                res.status(409).json({
                    message: 'Email already exists',
                });
                return;
            }

            // get a connection from the pool
            const connection = await getConnection() as PoolConnection;

            // Try and query the database
            try {
                // Start a transaction
                await connection.beginTransaction();
            
                // Insert the address into the database
                const [addressResult] = await connection.query<OkPacket>('INSERT INTO address (addressLine1, addressLine2, city, postcode) VALUES (?, ?, ?, ?)', [req.body.addressLine1, req.body.addressLine2, req.body.city, req.body.postcode]);
                const addressID = addressResult.insertId;

                // Insert the user into the database
                await connection.query(
                    'INSERT INTO users (firstName, lastName, email, password, roleID, telephone, addressID) VALUES (?, ?, ?, ?, ?, ?, ?);',
                    [firstName, lastName, email, hashedPassword, roleID, telephone, addressID]
                );

                // Commit the transaction
                await connection.commit();

                // Send email
                sendEmail(email, 'Welcome to ParkEasy', 'Thank you for registering with us!');

                // Send response
                res.status(200).json({
                    message: 'User account created',
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

            const corporate = new Corporate('', '', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (!existingUser && !existingCorporate) {
                res.status(404).json({
                    message: 'Account not found',
                });
                return;
            }

            // Check if password is correct
            const isPasswordCorrect = compareSync(password, existingUser ? existingUser.password : existingCorporate.password);

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

            const corporate = new Corporate('', '', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (!existingUser && !existingCorporate) {
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

            const corporate = new Corporate('', '', '', '', 0, '', 0);
            const existingCorporate = await corporate.findByEmail(email);

            if (!existingUser && !existingCorporate) {
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







    // ALL CODE BELOW THIS LINE IS FROM THE ORIGINAL ACCOUNT SERVICE FIL
    

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

    /**
     * Gets the user's profile.
     * @memberof AccountService
     * @description Gets the user's profile.
     * @param req The request.
     * @param res The response.
     * @throws 500 if the user's profile could not be retrieved.
     * @returns The user's profile.
     */
    static async findAccount(req: Request, res: Response) {
        // get data from request
        const { userToken } = req.body;

        // get email from token
        const email = await sessions.getEmail(userToken);

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

        // Try and query the database
        try {
            // For corporate users
            if (corporateUser) {
                const corporateProfile = await connection.query('SELECT email, name, telephone, addressID FROM corporate WHERE email = ?', [email]);
                const addressId = corporateProfile[0].addressID;

                res.status(200).json({
                    message: 'Corporate profile retrieved',
                    status: 'success',
                    data: corporateProfile[0]
                });
            } else if (personalUser) {
                const userProfile = await connection.query<OkPacket>('SELECT email, forename, lastname, addressID, telephone FROM users WHERE email = ?', [email]);

                res.status(200).json({
                    message: 'User profile retrieved',
                    status: 'success',
                    data: userProfile[0]
                });
            }
        } finally {
            // release the connection
            connection.release();
        }
    }


}