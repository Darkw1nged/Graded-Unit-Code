import { Request, Response } from 'express';
import { hashSync, genSaltSync } from 'bcrypt';
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

        // Check if the password is correct
        let isPasswordCorrect;

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
                isPasswordCorrect = password == rows[0].password;
            } else if (personalUser) {
                const [rows] = await connection.query<RowDataPacket[]>('SELECT password FROM personal WHERE email = ?', [email]);

                // Check if an account with the given email exists
                if (rows.length === 0) {
                    return false;
                }

                // Check if the password is correct
                isPasswordCorrect = password == rows[0].password;
            }
        } finally {
            // release the connection
            connection.release();
        }
        return isPasswordCorrect ? true : false;
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
                res.status(409).json({ message: 'Passwords do not match' });
                return;
            }

            // hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            const roleID = 2; // role is always 2 (corporate)

            // check if email already exists
            const existingCorporate = await corporate.findByEmail(email);
            if (existingCorporate) {
                res.status(409).json({ message: 'An account with that email already exists' });
                return;
            }

            // call create method to create corporate account
            await corporate.createCorporate(buisnessName, email, hashedPassword, roleID, telephone);

            // generate JWT token for the corporate account
            const token = sign({ id: randomUUID }, config.jwtSecret, { expiresIn: '1h' });

            // send response with the created corporate's details and JWT token
            res.status(201).json({
                message: 'Corporate account created successfully',
                access_token: token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
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
                res.status(409).json({ message: 'Passwords do not match' });
                return;
            }

            // hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            const roleID = 1; // role is always 1 (personal)

            // check if email already exists
            const existingPersonal = await user.findByEmail(email);
            if (existingPersonal) {
                res.status(409).json({ message: 'An account with that email already exists' });
                return;
            }

            // call create method to create personal account
            await user.createPersonal(forename, surname, email, hashedPassword, roleID);

            // generate JWT token for the personal account
            const token = sign({ id: randomUUID }, config.jwtSecret, { expiresIn: '1h' });

            // send response with the created personal's details and JWT token
            res.status(201).json({
                message: 'Personal account created successfully',
                access_token: token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
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
            res.status(404).json({ message: 'Email does not exist' });
            return;
        }

        // Check if the password is correct
        let isPasswordCorrect;
        if (corporateUser) {
            isPasswordCorrect = await AccountService.comparePassword(email, password);
        } else if (personalUser) {
            isPasswordCorrect = await AccountService.comparePassword(email, password);
        }

        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Password is incorrect' });
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
                messaage: 'Login successful',
                data: {
                    token: secret,
                    expiresIn
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
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
            res.status(404).json({ message: 'Email does not exist' });
            return;
        }

        // create a token
        const token = sessions.generateToken(email, 60 * 60);
        // create a link
        const link = `http://localhost:3000/reset-password?token=${token}`;

        // send email
        try {
            await sendEmail(email, 'Password Reset', `Click the link to reset your password: ${link}`);
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
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
            res.status(409).json({ message: 'Passwords do not match' });
            return;
        }

        // check if token is valid
        const isTokenValid = await sessions.verifyToken(token);

        // check if token is valid
        if (!isTokenValid) {
            res.status(401).json({ message: 'Token is invalid' });
            return;
        }

        // get email from token
        const email = await sessions.getEmail(token);
        if (!email) {
            res.status(401).json({ message: 'Token is invalid' });
            return;
        }

        // Check if the user is a corporate or a personal user
        const corporateUser = await corporate.findByEmail(email);
        const personalUser = await user.findByEmail(email);

        // Check if there is an account with the given email
        if (!corporateUser && !personalUser) {
            res.status(404).json({ message: 'Email does not exist' });
            return;
        }

        // get a connection from the pool
        const connection = await getConnection() as PoolConnection; 
        
        // Try and query the database
        try {
            // For corporate users
            if (corporateUser) {
                await connection.query('UPDATE corporate SET password = ? WHERE email = ?', [password, email]);
            } else if (personalUser) {
                await connection.query('UPDATE users SET password = ? WHERE email = ?', [password, email]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            return;
        } finally {
            // release the connection
            connection.release();
        }

        res.status(200).json({
            message: 'Password reset successful'
        });
    }

}

export default AccountService;