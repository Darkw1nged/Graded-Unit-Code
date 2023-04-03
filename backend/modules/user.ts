import pool from '../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Address from './address';

/**
 * Represents a user of the system.
 * @class
 * @description This is the class that will be used to represent a user of the system.
 * @memberof backend
 * @property {string} forename The user's forename.
 * @property {string} lastname The user's lastname.
 * @property {string} email The user's email address.
 * @property {string} password The user's password.
 * @property {number} role The user's role (Role ID).
 * @property {Address} address The user's address.
 * @property {string} telephone The user's telephone number.
 * @property {string} mobile The user's mobile number.
 */
export default class User {
    /**
     * The user's forename.
     * @type {string}
     * @memberof User
     * @description This is the user's first name.
     */
    forename: string;

    /**
     * The user's lastname.
     * @type {string}
     * @memberof User
     * @description This is the user's last name.
     */
    lastname: string;

    /**
     * The user's email address.
     * @type {string}
     * @memberof User
     * @description This is the email address that the user will use to log in to the system.
     */
    email: string;

    /**
     * The user's password.
     * @type {string}
     * @memberof User
     * @description This is the password that the user will use to log in to the system.
     */
    password: string;

    /**
     * The user's role (Role ID).
     * @type {number}
     * @memberof User
     * @description This is the role that the user has in the system.
     */
    roleID: number;

    /**
     * The user's address.
     * @type {Address}
     * @memberof User
     * @description This is where the user is located.
     */
    address?: Address;

    /**
     * The user's telephone number.
     * @type {string}
     * @memberof User
     * @description This is the telephone number that the ParkEasy team can use to contact the user.
     */
    telephone?: string;

    /**
     * The user's mobile number.
     * @type {string}
     * @memberof User
     * @description This is the mobile number that the ParkEasy team can use to contact the user.
     */
    mobile?: string;

    /**
     * The constructor for the user class.
     * @param forename The user's forename.
     * @param lastname The user's lastname.
     * @param address The user's address.
     * @param postcode The user's postcode.
     * @param telephone The user's telephone number.
     * @param mobile The user's mobile number.
     * @param email The user's email address.
     * @param password The user's password.
     * @param role The user's role.
     * @memberof User
     * @description This is the constructor for the user class.
     */
    constructor(forename: string, lastname: string, email: string, password: string, roleID: number, address?: Address, telephone?: string, mobile?: string) {
        this.forename = forename;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.roleID = roleID;
        this.address = address;
        this.telephone = telephone;
        this.mobile = mobile;
    }

    /**
     * Creates a new user in the database.
     * @param forename The user's forename.
     * @param lastname The user's lastname.
     * @param email The user's email address.
     * @param password The user's password.
     * @param roleID The user's role.
     * @param address The user's address.
     * @param telephone The user's telephone number.
     * @param mobile The user's mobile number.
     * @returns {Promise<void>}
     * @memberof User
     * @description This function creates a new user in the database.
     */
    static async createPersonal(
        forename: string,
        lastname: string,
        email: string,
        password: string,
        roleID: number,
        address?: Address,
        telephone?: string,
        mobile?: string
    ): Promise<void> {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Try and query the database
        try {

            // We need to check if an address was provided.
            // Before we can we need to create a variable to store the address ID.
            let addressID = null;

            // If an address was provided, we need to check if it already exists in the database.
            if (address) {
                addressID = await connection.query(
                    'SELECT id FROM addresses WHERE addressLineOne = ? AND `postcode` = ?',
                    [address.addressLineOne, address.postcode]
                );
    
                // If an address was not found, we need to create a new one.
                if (addressID.length === 0) {
                    // TODO - create a new address.
                }
            }

            // Now we can create the user.
            await connection.query(
                'INSERT INTO users (email, password, roleID, forename, lastname, addressID, telephone, mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [email, password, roleID, forename, lastname, addressID, telephone, mobile]
            );
        } finally {
            connection.release();
        }
    }

    /**
     * Finds a user by their email address.
     * @param email The user's email address.
     * @returns The found user, or null if no user was found.
     * @memberof User
     * @description This function finds a user by their email address.
     */
    static async findByEmail(email: string): Promise<User | null> {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Try and query the database
        try {
            // Query the database for the user
            const [rows] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            // If the user was found, we need to create a new user object.
            if (rows.length > 0) {
                return new User(
                    rows[0].forename,
                    rows[0].lastname,
                    rows[0].email,
                    rows[0].password,
                    rows[0].roleID,
                    rows[0].addressID,
                    rows[0].telephone,
                    rows[0].mobile
                );
            }
            // If the user was not found, return null
            return null;
        } finally {
            connection.release();
        }
    }

    // ---------------------------------- OLD CODE ----------------------------------

    /**
     * Gets and compares the users password.
     * @param email The email of the user.
     * @param passwordAttempt The password the user has attempted to use.
     * @returns True if the passwords match, false otherwise.
     * @throws An error if the password could not be compared.
     */
    static async comparePassword(email: string, passwordAttempt: string): Promise<boolean> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT password FROM users WHERE email="' + email + '"');
            if (rows.length === 0) {
                return false; // No user found
            }

            const passwordFound = rows[0].password;
            const isPasswordCorrect = bcrypt.compareSync(passwordAttempt, passwordFound);
            return isPasswordCorrect;
        } finally {
            connection.release();
        }
    }

    /**
     * Updates a user's password.
     * @param email The user's email address.
     * @param password The user's new password.
     * @throws An error if the password could not be updated.
     */
    static async updatePassword(email: string, password: string): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.query('UPDATE users SET password = ? WHERE email = ?', [password, email]);
        } finally {
            connection.release();
        }
    }

    /**
     * Generates a new token for a user.
     * @param email The user's email address.
     * @returns The generated token.
     * @throws An error if the token could not be generated.
     */
    static async generateToken(email: string, expirationTime?: number): Promise<string> {
        const payload = { email };
        const secret = process.env.JWT_SECRET || 'secret';

        const expiresIn = expirationTime || 604800;
        const token = jwt.sign(payload, secret, { expiresIn });
        return token;
    }

    /**
     * Validates a token.
     * @param token The token to validate.
     * @returns True if the token is valid, false otherwise.
     * @throws An error if the token could not be validated.
     */
    static async validateToken(token: string): Promise<boolean> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT email FROM sessions WHERE id=' + token);
            if (rows.length === 0) {
                return false; // invalid token
            }
            return true;
        } finally {
            connection.release();
        }
    }

    /**
     * Gets the user from a token.
     * @param token The token to get the user from.
     * @returns The user.
     * @throws An error if the user could not be found.
     */
    static async getUserFromToken(token: string): Promise<string | null> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT email FROM sessions WHERE id=' + token);
            if (rows.length === 0) {
                return null; // No user found
            }

            return rows[0].email;
        } finally {
            connection.release();
        }
    }

    /**
     * Create a new user session.
     * @param email The user's email address.
     * @param token The user's token.
     * @param expiresIn The time until the session expires.
     * @throws An error if the session could not be created.
     */
    static async createSession(email: string, token: string, expiresIn: number): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.query('INSERT INTO sessions (id, email, createdAt, expiresAt) VALUES (?, ?, ?, ?)', [token, email, new Date(), new Date(Date.now() + expiresIn)]);
        } finally {
            connection.release();
        }
    }

    /**
     * Deletes a user session.
     * @param email The user's email.
     * @throws An error if the session could not be deleted.
     * @returns True if the session was deleted, false otherwise.
     */
    static async deleteSession(token: string): Promise<boolean> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('DELETE FROM sessions WHERE id="' + token + '"');
            return rows.affectedRows === 1;
        } finally {
            connection.release();
        }
    }
}
