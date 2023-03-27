import { Request, Response } from 'express';
import user from './database/modules/user-details';
import { hashSync, genSaltSync } from 'bcrypt';
import { sendEmail } from './email-service';

class AccountHandler {

    /**
     * Creates a new user.
     * @param req The request.
     * @param res The response.
     * @returns The user's details.
     * @throws 409 if the email already exists.
     * @throws 500 if the user could not be created.
     */
    static async create(req: Request, res: Response) {
        // get data from request
        const { forename, surname, email, password } = req.body;
        // hash password
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);
        // role is always 1 (customer) for now
        const role = 1;

        // check if email already exists
        const existingUser = await user.findByEmail(email);
        if (existingUser) {
            res.status(409).json({ message: 'Email already exists' });
            return;
        }

        // call create method
        try {
            await user.create(forename, surname, email, hashedPassword, role);

            res.status(201).json({ 
                message: 'Account created successfully',
                data: {
                    forename,
                    surname,
                    email,
                    password: hashedPassword,
                    role
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

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

}

export default AccountHandler;