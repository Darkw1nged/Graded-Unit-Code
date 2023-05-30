"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Sender = __importStar(require("../utils/email.connector"));
const user_1 = __importDefault(require("../models/user"));
const person_1 = __importDefault(require("../models/person"));
const business_1 = __importDefault(require("../models/business"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
const payment_1 = __importDefault(require("../models/payment"));
const booking_1 = __importDefault(require("../models/booking"));
const emergancy_contact_1 = __importDefault(require("../models/emergancy_contact"));
class UserService {
    /**
   * Retrieves all users.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   */
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all users
                const users = yield user_1.default.getUsers();
                // Filter out deleted users
                const filteredUsers = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const deleted = yield user_1.default.isDeleted(user.email);
                    return deleted ? null : user;
                })));
                // Remove null values from the array
                const updatedUsers = filteredUsers.filter(user => user !== null);
                res.status(200).json({ users: updatedUsers });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves all deleted users.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getDeletedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all users
                const users = yield user_1.default.getUsers();
                // Filter out non-deleted users
                const filteredUsers = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const deleted = yield user_1.default.isDeleted(user.email);
                    return !deleted ? null : user;
                })));
                // Remove null values from the array
                const updatedUsers = filteredUsers.filter(user => user !== null);
                res.status(200).json({ users: updatedUsers });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves customers (persons and businesses).
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getCustomers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all users
                const users = yield user_1.default.getUsers();
                // Filter customers based on role and deletion status
                const customers = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const deleted = yield user_1.default.isDeleted(user.email);
                    if (deleted) {
                        return null;
                    }
                    if (user.role === "person" || user.role === "business") {
                        return user;
                    }
                    return null;
                })));
                // Remove null values from the array
                const filteredCustomers = customers.filter(customer => customer !== null);
                res.status(200).json({ users: filteredCustomers });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves all persons.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getPersons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all persons
                const persons = yield person_1.default.getPersons();
                res.status(200).json({ persons: persons });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves all businesses.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getBusiness(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all businesses
                const business = yield business_1.default.getBusiness();
                res.status(200).json({ business: business });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves all staff members.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all staff members
                const staff = yield user_1.default.getStaff();
                res.status(200).json({ staff: staff });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves all admins.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get all admins
                const admins = yield user_1.default.getAdmins();
                res.status(200).json({ admins: admins });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Adds a personal user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static addPersonal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { forename, surname, email, password, confirmPassword } = req.body;
            try {
                if (password !== confirmPassword) {
                    res.status(400).json({ message: 'Passwords do not match' });
                    return;
                }
                // hash password
                const salt = yield (0, bcrypt_1.genSaltSync)(10);
                const hashedPassword = yield (0, bcrypt_1.hashSync)(password, salt);
                // check if user exists
                const user = yield user_1.default.findByEmail(email);
                if (user !== undefined) {
                    res.status(409).json({ message: 'User already exists' });
                    return;
                }
                const userID = yield user_1.default.create(new user_1.default(email, hashedPassword, 'person'));
                if (!userID || userID === null) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                const personID = yield person_1.default.create(new person_1.default(userID, forename, surname));
                if (!personID) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                res.status(200).json({ message: 'Account created' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Adds a business user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static addBusiness(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, telephone, email, password, confirmPassword } = req.body;
            try {
                if (password !== confirmPassword) {
                    res.status(400).json({ message: 'Passwords do not match' });
                    return;
                }
                // hash password
                const salt = yield (0, bcrypt_1.genSaltSync)(10);
                const hashedPassword = yield (0, bcrypt_1.hashSync)(password, salt);
                const user = yield user_1.default.findByEmail(email);
                if (user !== undefined) {
                    res.status(409).json({ message: 'User already exists' });
                    return;
                }
                const userID = yield user_1.default.create(new user_1.default(email, hashedPassword, 'business'));
                if (!userID || userID === null) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                const newUser = yield user_1.default.findByEmail(email);
                if (!newUser || newUser === null) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                newUser.telephone = telephone;
                yield user_1.default.update(newUser);
                const businessID = yield business_1.default.create(new business_1.default(userID, name));
                if (!businessID) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                Sender.sendEmail(email, 'Welcome to ParkEasy', 'Thank you for registering with us! You have successfully created a business account.');
                res.status(200).json({ message: 'Account created' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Adds a staff member.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static addStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { staffMember, emergancyContact, email } = req.body;
            try {
                if (!email) {
                    res.status(400).json({ message: 'User not found.' });
                    return;
                }
                const user = yield user_1.default.findByEmail(email);
                if (!user) {
                    res.status(404).json({ message: 'User not found.' });
                    return;
                }
                if (user.role !== 'admin' && user.role !== 'manager') {
                    res.status(401).json({ message: 'You do not have permission to add staff.' });
                    return;
                }
                const staff = yield user_1.default.findByEmail(staffMember);
                if (staff !== undefined) {
                    res.status(404).json({ message: 'Staff member already exists' });
                    return;
                }
                if (staffMember.password !== staffMember.confirmPassword) {
                    res.status(400).json({ message: 'Passwords do not match' });
                    return;
                }
                // hash password
                const salt = yield (0, bcrypt_1.genSaltSync)(10);
                const hashedPassword = yield (0, bcrypt_1.hashSync)(staffMember.password, salt);
                const userID = yield user_1.default.create(new user_1.default(staffMember.email, hashedPassword, staffMember.role, '', staffMember.telephone, staffMember.addressLineOne, staffMember.addressLineTwo, staffMember.city, '', staffMember.zip, staffMember.country));
                if (!userID || userID === null) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                const personID = yield person_1.default.create(new person_1.default(userID, staffMember.forename, staffMember.surname));
                if (!personID) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                emergancy_contact_1.default.create(new emergancy_contact_1.default(userID, emergancyContact.forename, emergancyContact.surname, emergancyContact.telephone, emergancyContact.addressLineOne, emergancyContact.addressLineTwo, emergancyContact.city, '', emergancyContact.zip, emergancyContact.country));
                res.status(200).json({ message: 'Staff member created' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Logs in a user.
     * @param req  - The request object.
     * @param res - The response object.
     */
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, rememberMe } = req.body;
            try {
                const user = yield user_1.default.findByEmail(email);
                if (user === null) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const user_id = yield user_1.default.getUserID(email);
                if (user_id === null) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const deleted = yield user_1.default.isDeleted(email);
                if (deleted) {
                    res.status(401).json({ message: 'This account has been deleted and can not be recovered.' });
                    return;
                }
                // hash password
                const salt = yield (0, bcrypt_1.genSaltSync)(10);
                const hashedPassword = yield (0, bcrypt_1.hashSync)(password, salt);
                const result = (0, bcrypt_1.compareSync)(password, user.password);
                if (!result) {
                    user_1.default.addLoginAttempt(user_id, hashedPassword, false);
                    res.status(401).json({ message: 'Invalid password' });
                    return;
                }
                if (user.suspended) {
                    user_1.default.addLoginAttempt(user_id, hashedPassword, false);
                    res.status(401).json({ message: 'Account suspended' });
                    return;
                }
                const payload = { email };
                const secret = process.env.JWT_SECRET || 'secret';
                const options = { expiresIn: rememberMe ? '7d' : '2h' };
                const token = jsonwebtoken_1.default.sign(payload, secret, options);
                if (rememberMe) {
                    user.remember_token = token;
                    yield user_1.default.update(user);
                }
                user_1.default.addLoginAttempt(user_id, hashedPassword, true);
                res.status(200).json({
                    message: 'Login successful',
                    access_token: token,
                    expires: options.expiresIn,
                    email: user.email,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Logs out a user.
     * @param req  - The request object.
     * @param res - The response object.
     */
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield user_1.default.findByEmail(email);
                if (user === null) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                user.remember_token = "";
                yield user_1.default.update(user);
                res.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Updates a users details.
     * @param req - The request object.
     * @param res - The response object.
     */
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, person, business } = req.body;
            try {
                const foundUser = yield user_1.default.findByEmail(user.email);
                if (foundUser === null) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const user_id = yield user_1.default.getUserID(user.email);
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
                yield user_1.default.update(foundUser);
                if (foundUser.role === 'business') {
                    const foundBusiness = yield business_1.default.getByUserID(user_id);
                    if (foundBusiness === null) {
                        res.status(404).json({ message: 'Business not found' });
                        return;
                    }
                    foundBusiness.name = business.name;
                    foundBusiness.slogan = business.slogan;
                    foundBusiness.description = business.description;
                    yield business_1.default.update(foundBusiness, foundUser.email);
                }
                else {
                    const foundPerson = yield person_1.default.getByUserID(user_id);
                    if (foundPerson === null) {
                        res.status(404).json({ message: 'Person not found' });
                        return;
                    }
                    foundPerson.forename = person.forename;
                    foundPerson.surname = person.surname;
                    yield person_1.default.update(foundPerson, foundUser.email);
                }
                res.status(200).json({
                    message: 'User updated',
                    user: foundUser,
                    person,
                    business,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Deletes a user.
     * @param req - The request object.
     * @param res - The response object.
     */
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const userID = yield user_1.default.delete(email);
                if (!userID) {
                    res.status(500).json({ message: 'Internal server error' });
                }
                res.status(200).json({ message: 'User deleted' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Gets a user by email.
     * @param req - The request object.
     * @param res - The response object.
     */
    static find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield user_1.default.findByEmail(email);
                if (user === null) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const user_id = yield user_1.default.getUserID(email);
                if (user_id === null) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const person = yield person_1.default.getByUserID(user_id);
                const business = yield business_1.default.getByUserID(user_id);
                const vehicles = yield vehicle_1.default.getAllByUserID(user_id);
                const cards = yield payment_1.default.getAllByUserID(user_id);
                const bookings = yield booking_1.default.getAllByUserID(user_id);
                res.status(200).json({
                    user,
                    person,
                    business,
                    payments: cards,
                    cards,
                    vehicles,
                    bookings,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Resets a users password.
     * @param req - The request object.
     * @param res - The response object.
     */
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, confirmPassword } = req.body;
            try {
                if (password !== confirmPassword) {
                    res.status(400).json({ message: 'Passwords do not match' });
                    return;
                }
                // hash password
                const salt = yield (0, bcrypt_1.genSaltSync)(10);
                const hashedPassword = yield (0, bcrypt_1.hashSync)(password, salt);
                const user = yield user_1.default.findByEmail(email);
                if (user === null) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                user.password = hashedPassword;
                yield user_1.default.update(user);
                res.status(200).json({ message: 'Password updated' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = UserService;
