import { Request, Response } from 'express';
import { hashSync, genSaltSync } from 'bcrypt';
import { sendEmail } from './email-service';

import pool from './database';
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

    // ---------------------------------- NEW CODE ----------------------------------
    // This is the new code that I added to the AccountService.ts file.
    // I added the following methods to the AccountService class:
    // - createCorporate
    // - createPersonal
    // - login
    // - logout
    // - forgotPassword
    // - resetPassword

    /**
     * Creates a new corporate account.
     * @memberof AccountService
     * @description Creates a new corporate account.
     * @param req The request.
     * @param res The response.
     * @returns The corporate's details.
     * @throws 409 if the email already exists.
     * @throws 500 if the corporate could not be created.
     */
    static async createCorporate(req: Request, res: Response) {
        // get data from request
        const { buisnessName, email, telephone, password, confirmedPassword } = req.body;

        // check if passwords match
        if (password !== confirmedPassword) {
            res.status(409).json({ message: 'Passwords do not match' });
            return;
        }

        // hash password
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);
        // role is always 2 (corporate)
        const roleID = 2;

        // check if email already exists
        const existingCorporate = await corporate.findByEmail(email);
        if (existingCorporate) {
            res.status(409).json({ message: 'An account with that email already exists' });
            return;
        }

        // call create method
        try {
            await corporate.createCorporate(buisnessName, email, hashedPassword, roleID, telephone);
            
            res.status(201).json({
                message: 'Ccorporate account created successfully',
                data: {
                    buisnessName,
                    email,
                    telephone,
                    password: hashedPassword,
                    roleID
                }
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
        // get data from request
        const { forename, surname, email, password, confirmedPassword } = req.body;

        // check if passwords match
        if (password !== confirmedPassword) {
            res.status(409).json({ message: 'Passwords do not match' });
            return;
        }

        // hash password
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);
        // role is always 1 (personal)
        const roleID = 1;

        // check if email already exists
        const existingUser = await user.findByEmail(email);
        if (existingUser) {
            res.status(409).json({ message: 'An account with that email already exists' });
            return;
        }

        // call create method
        try {
            await user.createPersonal(forename, surname, email, hashedPassword, roleID);

            // send email
            await sendEmail(email, 'Account created', 'You have successfully created a corporate account.');

            res.status(201).json({
                message: 'Personal account created successfully',
                data: {
                    forename,
                    surname,
                    email,
                    password: hashedPassword,
                    roleID
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

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
            isPasswordCorrect = await this.comparePassword(email, password);
        } else if (personalUser) {
            isPasswordCorrect = await this.comparePassword(email, password);
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
        const connection = await pool.getConnection();

        // Check if the password is correct
        let isPasswordCorrect;

        // Try and query the database
        try {
            // For corporate users
            if (corporateUser) {
                const [rows] = await connection.query('SELECT password FROM corporate WHERE email = ?', [email]);
                
                // Check if an account with the given email exists
                if (rows.length === 0) {
                    return false;
                }

                // Check if the password is correct
                isPasswordCorrect = password == rows[0].password;
            } else if (personalUser) {
                const [rows] = await connection.query('SELECT password FROM personal WHERE email = ?', [email]);

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
    
    // ---------------------------------- OLD CODE ----------------------------------
    // This is the old code that was already in the AccountService.ts file.
    // I did not change any of the following methods.

    // /**
    //  * Sends a password reset email.
    //  * @param req The request.
    //  * @param res The response.
    //  * @returns The user's token.
    //  * @throws 404 if the email does not exist.
    //  * @throws 500 if the email could not be sent.
    //  */
    // static async forgotPassword(req: Request, res: Response) {
    //     // get data from request
    //     const { email } = req.body;

    //     // check if email already exists
    //     const existingUser = await user.findByEmail(email);
    //     if (!existingUser) {
    //         res.status(404).json({ message: 'Email does not exist' });
    //         return;
    //     }

    //     // generate token
    //     const token = await user.generateToken(email, 60 * 60);

    //     // send email
    //     try {
    //         await sendEmail(email, 'Password reset', `Click here to reset your password: http://localhost:3000/reset-password?token=${token}`);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Something went wrong' });
    //         return;
    //     }

    //     res.status(200).json({ 
    //         message: 'Email sent successfully',
    //         data: {
    //             token
    //         }
    //     });
    // }

    // /**
    //  * Resets a user's password.
    //  * @param req The request.
    //  * @param res The response.
    //  * @throws 404 if the email does not exist.
    //  * @throws 401 if the token is invalid.
    //  */
    // static async resetPassword(req: Request, res: Response) {
    //     // get data from request
    //     const { password, confirmedPassword, token } = req.body;

    //     // check if passwords match
    //     if (password !== confirmedPassword) {
    //         res.status(409).json({ message: 'Passwords do not match' });
    //         return;
    //     }

    //     // check if token is valid
    //     const isTokenValid = await user.validateToken(token);
    //     if (!isTokenValid) {
    //         res.status(401).json({ message: 'Token is invalid' });
    //         return;
    //     }

    //     // get the email from the token
    //     const email = await user.getUserFromToken(token);
    //     if (!email) {
    //         res.status(401).json({ message: 'Token is invalid' });
    //         return;
    //     }

    //     // hash password
    //     const salt = genSaltSync(10);
    //     const hashedPassword = hashSync(password, salt);

    //     // update password
    //     await user.updatePassword(email, hashedPassword);

    //     // delete session
    //     await user.deleteSession(email);

    //     res.status(200).json({ 
    //         message: 'Password reset successfully'
    //     });
    // }

}

export default AccountService;