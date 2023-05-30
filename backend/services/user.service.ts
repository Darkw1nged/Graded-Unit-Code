import { Request, Response } from 'express';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Sender from '../utils/email.connector';
import User from '../models/user'
import Person from '../models/person';
import Business from '../models/business';
import Vehicle from '../models/vehicle';
import Payment from '../models/payment';
import Booking from '../models/booking';
import EmergancyContact from '../models/emergancy_contact';

class UserService {

    /**
   * Retrieves all users.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
    static async getUsers(req: Request, res: Response) {
        try {
            // Get all users
            const users: User[] = await User.getUsers();

            // Filter out deleted users
            const filteredUsers = await Promise.all(users.map(async (user) => {
                const deleted: boolean = await User.isDeleted(user.email);
                return deleted ? null : user;
            }));

            // Remove null values from the array
            const updatedUsers = filteredUsers.filter(user => user !== null);

            res.status(200).json({ users: updatedUsers });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves all deleted users.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getDeletedUsers(req: Request, res: Response) {
        try {
            // Get all users
            const users: User[] = await User.getUsers();

            // Filter out non-deleted users
            const filteredUsers = await Promise.all(users.map(async (user) => {
                const deleted: boolean = await User.isDeleted(user.email);
                return !deleted ? null : user;
            }));

            // Remove null values from the array
            const updatedUsers = filteredUsers.filter(user => user !== null);

            res.status(200).json({ users: updatedUsers });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves customers (persons and businesses).
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getCustomers(req: Request, res: Response) {
        try {
            // Get all users
            const users: User[] = await User.getUsers();

            // Filter customers based on role and deletion status
            const customers = await Promise.all(users.map(async (user) => {
                const deleted: boolean = await User.isDeleted(user.email);

                if (deleted) {
                    return null;
                }

                if (user.role === "person" || user.role === "business") {
                    return user;
                }

                return null;
            }));

            // Remove null values from the array
            const filteredCustomers = customers.filter(customer => customer !== null);

            res.status(200).json({ users: filteredCustomers });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves all persons.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getPersons(req: Request, res: Response) {
        try {
            // Get all persons
            const persons: Person[] = await Person.getPersons();

            res.status(200).json({ persons: persons });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves all businesses.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getBusiness(req: Request, res: Response) {
        try {
            // Get all businesses
            const business: Business[] = await Business.getBusiness();

            res.status(200).json({ business: business });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves all staff members.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getStaff(req: Request, res: Response) {
        try {
            // Get all staff members
            const staff: User[] = await User.getStaff();

            res.status(200).json({ staff: staff });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves all admins.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getAdmins(req: Request, res: Response) {
        try {
            // Get all admins
            const admins: User[] = await User.getAdmins();

            res.status(200).json({ admins: admins });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Adds a personal user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async addPersonal(req: Request, res: Response) {
        const { forename, surname, email, password, confirmPassword } = req.body;
        try {
            if (password !== confirmPassword) {
                res.status(400).json({ message: 'Passwords do not match' });
                return;
            }

            // hash password
            const salt = await genSaltSync(10);
            const hashedPassword = await hashSync(password, salt);

            // check if user exists
            const user: User | null = await User.findByEmail(email);
            if (user !== undefined) {
                res.status(409).json({ message: 'User already exists' });
                return;
            }

            const userID: number = await User.create(new User(email, hashedPassword, 'person'));
            if (!userID || userID === null) {
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            const personID: number = await Person.create(new Person(userID, forename, surname));
            if (!personID) {
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            res.status(200).json({ message: 'Account created' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Adds a business user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async addBusiness(req: Request, res: Response) {
        const { name, telephone, email, password, confirmPassword } = req.body;
        try {

            if (password !== confirmPassword) {
                res.status(400).json({ message: 'Passwords do not match' });
                return;
            }

            // hash password
            const salt = await genSaltSync(10);
            const hashedPassword = await hashSync(password, salt);

            const user: User | null = await User.findByEmail(email);
            if (user !== undefined) {
                res.status(409).json({ message: 'User already exists' });
                return;
            }

            const userID: number = await User.create(new User(email, hashedPassword, 'business'));
            if (!userID || userID === null) {
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            const newUser = await User.findByEmail(email);
            if (!newUser || newUser === null) {
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
            newUser.telephone = telephone;
            await User.update(newUser);

            const businessID: number = await Business.create(new Business(userID, name));
            if (!businessID) {
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            Sender.sendEmail(email, 'Welcome to ParkEasy', 'Thank you for registering with us! You have successfully created a business account.');

            res.status(200).json({ message: 'Account created' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Adds a staff member.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async addStaff(req: Request, res: Response) {
        const { staffMember, emergancyContact, email } = req.body;
        try {
            if (!email) {
                res.status(400).json({ message: 'User not found.' });
                return;
            }
            const user = await User.findByEmail(email);
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            if (user.role !== 'admin' && user.role !== 'manager') {
                res.status(401).json({ message: 'You do not have permission to add staff.' });
                return;
            }

            const staff: User | null = await User.findByEmail(staffMember);
            if (staff !== undefined) {
                res.status(404).json({ message: 'Staff member already exists' });
                return;
            }

            if (staffMember.password !== staffMember.confirmPassword) {
                res.status(400).json({ message: 'Passwords do not match' });
                return;
            }

            // hash password
            const salt = await genSaltSync(10);
            const hashedPassword = await hashSync(staffMember.password, salt);

            const userID: number = await User.create(new User(staffMember.email, hashedPassword, staffMember.role, '', staffMember.telephone,
                staffMember.addressLineOne, staffMember.addressLineTwo, staffMember.city, '', staffMember.zip, staffMember.country));

            if (!userID || userID === null) {
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            const personID: number = await Person.create(new Person(userID, staffMember.forename, staffMember.surname));
            if (!personID) {
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            EmergancyContact.create(new EmergancyContact(userID, emergancyContact.forename, emergancyContact.surname, emergancyContact.telephone,
                emergancyContact.addressLineOne, emergancyContact.addressLineTwo, emergancyContact.city, '', emergancyContact.zip, emergancyContact.country));

            res.status(200).json({ message: 'Staff member created' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Logs in a user.
     * @param req  - The request object.
     * @param res - The response object.
     */
    static async login(req: Request, res: Response) {
        const { email, password, rememberMe } = req.body;
        try {
            const user: User | null = await User.findByEmail(email);
            if (user === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const user_id: number | null = await User.getUserID(email);
            if (user_id === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const deleted: boolean = await User.isDeleted(email);
            if (deleted) {
                res.status(401).json({ message: 'This account has been deleted and can not be recovered.' });
                return;
            }

            // hash password
            const salt = await genSaltSync(10);
            const hashedPassword = await hashSync(password, salt);

            const result = compareSync(password, user.password);
            if (!result) {
                User.addLoginAttempt(user_id, hashedPassword, false);
                res.status(401).json({ message: 'Invalid password' });
                return;
            }

            if (user.suspended) {
                User.addLoginAttempt(user_id, hashedPassword, false);
                res.status(401).json({ message: 'Account suspended' });
                return;
            }

            const payload = { email };
            const secret = process.env.JWT_SECRET || 'secret';
            const options = { expiresIn: rememberMe ? '7d' : '2h' };
            const token = jwt.sign(payload, secret, options);

            if (rememberMe) {
                user.remember_token = token;
                await User.update(user);
            }

            User.addLoginAttempt(user_id, hashedPassword, true);
            res.status(200).json({
                message: 'Login successful',
                access_token: token,
                expires: options.expiresIn,
                email: user.email,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Logs out a user.
     * @param req  - The request object.
     * @param res - The response object.
     */
    static async logout(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user: User | null = await User.findByEmail(email);
            if (user === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            user.remember_token = "";
            await User.update(user);

            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Updates a users details.
     * @param req - The request object.
     * @param res - The response object.
     */
    static async update(req: Request, res: Response) {
        const { user, person, business } = req.body;
        try {
            const foundUser: User | null = await User.findByEmail(user.email);
            if (foundUser === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const user_id: number | null = await User.getUserID(user.email);
            if (user_id === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            foundUser.telephone = user.telephone;
            foundUser.addressLineOne = user.addressLineOne;
            foundUser.addressLineTwo = user.addressLineTwo;
            foundUser.city = user.city;
            foundUser.zip = user.zip;
            foundUser.country = user.country;
            await User.update(foundUser);

            if (foundUser.role === 'business') {
                const foundBusiness: Business | null = await Business.getByUserID(user_id);
                if (foundBusiness === null) {
                    res.status(404).json({ message: 'Business not found' });
                    return;
                }

                foundBusiness.name = business.name;
                foundBusiness.slogan = business.slogan;
                foundBusiness.description = business.description;
                await Business.update(foundBusiness, foundUser.email);
            } else {
                const foundPerson: Person | null = await Person.getByUserID(user_id);
                if (foundPerson === null) {
                    res.status(404).json({ message: 'Person not found' });
                    return;
                }

                foundPerson.forename = person.forename;
                foundPerson.surname = person.surname;
                await Person.update(foundPerson, foundUser.email)
            }

            res.status(200).json({
                message: 'User updated',
                user: foundUser,
                person,
                business,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Deletes a user.
     * @param req - The request object.
     * @param res - The response object.
     */
    static async delete(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const userID: number = await User.delete(email);
            if (!userID) {
                res.status(500).json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'User deleted' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Gets a user by email.
     * @param req - The request object.
     * @param res - The response object.
     */
    static async find(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user: User | null = await User.findByEmail(email);
            if (user === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const user_id: number | null = await User.getUserID(email);
            if (user_id === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const person: Person | null = await Person.getByUserID(user_id);
            const business: Business | null = await Business.getByUserID(user_id);
            const vehicles: Vehicle[] | null = await Vehicle.getAllByUserID(user_id);
            const cards: Payment[] | null = await Payment.getAllByUserID(user_id);
            const bookings: Booking[] | null = await Booking.getAllByUserID(user_id);

            res.status(200).json({
                user,
                person,
                business,
                payments: cards,
                cards,
                vehicles,
                bookings,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Resets a users password.
     * @param req - The request object.
     * @param res - The response object.
     */
    static async resetPassword(req: Request, res: Response) {
        const { email, password, confirmPassword } = req.body;
        try {
            if (password !== confirmPassword) {
                res.status(400).json({ message: 'Passwords do not match' });
                return;
            }

            // hash password
            const salt = await genSaltSync(10);
            const hashedPassword = await hashSync(password, salt);

            const user: User | null = await User.findByEmail(email);
            if (user === null) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            user.password = hashedPassword;
            await User.update(user);

            res.status(200).json({ message: 'Password updated' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default UserService;