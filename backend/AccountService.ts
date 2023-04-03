import { Request, Response } from 'express';
import { hashSync, genSaltSync } from 'bcrypt';
import { sendEmail } from './email-service';

import user from './modules/user';
import corporate from './modules/corporate';

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
    
    // ---------------------------------- OLD CODE ----------------------------------
    // This is the old code that was already in the AccountService.ts file.
    // I did not change any of the following methods.

    /**
     * Logs a user in.
     * @param req The request.
     * @param res The response.
     * @returns The user's token.
     * @throws 404 if the email does not exist.
     * @throws 401 if the password is incorrect.
     */
    static async login(req: Request, res: Response) {
        // get data from request
        const { email, password, rememberMe } = req.body;

        // check if email already exists
        const existingUser = await user.findByEmail(email);
        if (!existingUser) {
            res.status(404).json({ message: 'Email does not exist' });
            return;
        }

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(email, password);
        if (!isPasswordCorrect) {
            console.log('Password is incorrect')
            res.status(401).json({ message: 'Password is incorrect' });
            return;
        }

        // generate token
        let token;
        let expiresIn;
        if (rememberMe) {
            token = await user.generateToken(email, 30 * 24 * 60 * 60);
            expiresIn = 30 * 24 * 60 * 60;
        } else {
            token = await user.generateToken(email, 60 * 60);
            expiresIn = 60 * 60;
        }

        // create session
        await user.createSession(email, token, expiresIn);

        // send email
        await sendEmail(email, 'Login successful', 'You have successfully logged in to your account.');

        res.status(200).json({ 
            message: 'Login successful',
            data: {
                token,
                expiresIn
            }
        });
    }

    /**
     * Logs a user out.
     * @param req The request.
     * @param res The response.
     * @returns The user's token.
     */
    static async logout(req: Request, res: Response) {
        // get data from request
        const { userToken } = req.body;

        // delete session
        await user.deleteSession(userToken);
        
        res.status(200).json({
            message: 'Logout successful'
        });
    }

    /**
     * Sends a password reset email.
     * @param req The request.
     * @param res The response.
     * @returns The user's token.
     * @throws 404 if the email does not exist.
     * @throws 500 if the email could not be sent.
     */
    static async forgotPassword(req: Request, res: Response) {
        // get data from request
        const { email } = req.body;

        // check if email already exists
        const existingUser = await user.findByEmail(email);
        if (!existingUser) {
            res.status(404).json({ message: 'Email does not exist' });
            return;
        }

        // generate token
        const token = await user.generateToken(email, 60 * 60);

        // send email
        try {
            await sendEmail(email, 'Password reset', `Click here to reset your password: http://localhost:3000/reset-password?token=${token}`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
            return;
        }

        res.status(200).json({ 
            message: 'Email sent successfully',
            data: {
                token
            }
        });
    }

    /**
     * Resets a user's password.
     * @param req The request.
     * @param res The response.
     * @throws 404 if the email does not exist.
     * @throws 401 if the token is invalid.
     */
    static async resetPassword(req: Request, res: Response) {
        // get data from request
        const { password, confirmedPassword, token } = req.body;

        // check if passwords match
        if (password !== confirmedPassword) {
            res.status(409).json({ message: 'Passwords do not match' });
            return;
        }

        // check if token is valid
        const isTokenValid = await user.validateToken(token);
        if (!isTokenValid) {
            res.status(401).json({ message: 'Token is invalid' });
            return;
        }

        // get the email from the token
        const email = await user.getUserFromToken(token);
        if (!email) {
            res.status(401).json({ message: 'Token is invalid' });
            return;
        }

        // hash password
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);

        // update password
        await user.updatePassword(email, hashedPassword);

        // delete session
        await user.deleteSession(email);

        res.status(200).json({ 
            message: 'Password reset successfully'
        });
    }

}

export default AccountService;