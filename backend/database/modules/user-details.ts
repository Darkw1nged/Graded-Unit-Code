import pool from '../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Represents a user of the system.
 */
export default class User {
    /**
     * The user's forename.
     */
    forename: string;

    /**
     * The user's lastname.
     */
    lastname: string;

    /**
     * The user's address.
     */
    address?: string;

    /**
     * The user's postcode.
     */
    postcode?: string;

    /**
     * The user's telephone number.
     */
    telephone?: string;

    /**
     * The user's mobile number.
     */
    mobile?: string;

    /**
     * The user's email address.
     */
    email: string;

    /**
     * The user's password.
     */
    password: string;
    
    /**
     * The user's role.
     */
    role: number;

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
     */
    constructor(forename: string, lastname: string, email: string, password: string, role: number, address?: string, postcode?: string, telephone?: string, mobile?: string) {
        this.forename = forename;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.address = address;
        this.postcode = postcode;
        this.telephone = telephone;
        this.mobile = mobile;
    }

    /**
     * Creates a new user in the database.
     * @param forename The user's forename.
     * @param lastname The user's lastname.
     * @param address The user's address.
     * @param postcode The user's postcode.
     * @param telephone The user's telephone number.
     * @param mobile The user's mobile number.
     * @param email The user's email address.
     * @param password The user's password.
     */
    static async create(
        forename: string,
        lastname: string,
        email: string,
        password: string,
        roleID: number,
        address?: string,
        postcode?: string,
        telephone?: string,
        mobile?: string
    ): Promise<void> {
        const connection = await pool.getConnection();

        console.log(forename, lastname, email, password, roleID, address, postcode, telephone, mobile)

        try {
            await connection.query(
                'INSERT INTO users (email, password, roleID, forename, lastname, address, postcode, telephone, mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [email, password, roleID, forename, lastname, address, postcode, telephone, mobile]
            );
        } finally {
            connection.release();
        }
    }

    /**
     * Finds a user by their email address.
     * @param email The user's email address.
     * @returns The found user, or null if no user was found.
     */
    static async findByEmail(email: string): Promise<User | null> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows.length ? new User(rows[0].forename, rows[0].lastname, rows[0].address, rows[0].postcode, rows[0].telephone, rows[0].mobile, rows[0].email, rows[0].password) : null;
        } finally {
            connection.release();
        }
    }

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
}
