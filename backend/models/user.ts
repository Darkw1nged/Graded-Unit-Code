import * as MySqlConnector from '../utils/mysql.connector';
import { OkPacket, RowDataPacket } from 'mysql2';

/**
 * Represents a User Data Access Object (DAO) for interacting with user data in the database.
 */
class UserDAO {
    /**
     * Finds a user by their email address.
     * @param {string} email - The email address of the user.
     * @returns {Promise<User | null>} A Promise that resolves to the User object if found, or null if not found.
     */
    async findByEmail(email: string): Promise<User | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0] as User;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Finds a user by their ID.
     * @param {number} id - The ID of the user.
     * @returns {Promise<User | null>} A Promise that resolves to the User object if found, or null if not found.
     */
    async findByID(id: number): Promise<User | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0] as User;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Gets the user ID for a given email address.
     * @param {string} email - The email address of the user.
     * @returns {Promise<number | null>} A Promise that resolves to the user ID if found, or null if not found.
     */
    async getUserID(email: string): Promise<number | null> {
        try {
            if (email === undefined) return null;
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
            return rows.length !== 0 ? rows[0].id : null;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Checks if a user is marked as deleted in the database.
     * @param {string} email - The email address of the user.
     * @returns {Promise<boolean>} A Promise that resolves to true if the user is deleted, or false otherwise.
     */
    async isDeleted(email: string): Promise<boolean> {
        try {
            const pool = await MySqlConnector.getPool();
            const user_id = await this.getUserID(email);
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM deleted_users WHERE user_id = ?', [user_id]);
            return rows.length > 0;
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    /**
     * Creates a new user in the database.
     * @param {User} user - The user object containing the user details.
     * @returns {Promise<number>} A Promise that resolves to the ID of the created user.
     */
    async create(user: User): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [user.getEmail(), user.getPassword(), user.getRole()]);

            console.log('[Server]: user created, ' + user.getEmail());
            return rows.insertId;
        } catch (error) {
            console.log('[Server]: user could not be created, ' + user.getEmail() + ', ' + error);
        }
        return -1;
    }

    /**
     * Updates an existing user in the database.
     * @param {User} user - The user object containing the updated user details.
     * @returns {Promise<number>} A Promise that resolves to the ID of the updated user.
     */
    async update(user: User): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();

            const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [user.email]);
            const id = rows[0].id;

            await pool.query('UPDATE users SET email = ?, password = ?, remember_token = ?, role = ?, telephone = ?, addressLineOne = ?, addressLineTwo = ?, city = ?, region = ?, zip = ?, country = ?, suspended = ? WHERE id = ?',
                [user.email, user.password, user.remember_token, user.role, user.telephone, user.addressLineOne, user.addressLineTwo, user.city, user.region, user.zip, user.country, user.suspended, id]);

            console.log('[Server]: user updated, ' + user.email);
            return id;
        } catch (error) {
            console.log('[Server]: user could not be updated, ' + error);
        }
        return -1;
    }

    /**
     * Deletes a user from the database.
     * @param {string} email - The email address of the user to be deleted.
     * @param {string} [note] - Optional note specifying the reason for deletion.
     * @returns {Promise<number>} A Promise that resolves to the ID of the deleted user.
     */
    async delete(email: string, note?: string): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();
            const user_id = await this.getUserID(email);
            const [rows] = await pool.query<OkPacket>('INSERT INTO deleted_users (user_id, notes) VALUES(?, ?)', [user_id, note]);

            console.log('[Server]: user deleted, ' + email);
            return rows.insertId;
        } catch (error) {
            console.log('[Server]: user could not be deleted, ' + email + ', ' + error);
        }
        return -1;
    }

    /**
     * Suspends a user in the database.
     * @param {string} email - The email address of the user to be suspended.
     * @returns {Promise<number>} A Promise that resolves to the ID of the suspended user.
     */
    async suspend(email: string): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('UPDATE users SET suspended = 1 WHERE email = ?', [email]);

            console.log('[Server]: user suspended, ' + email);
            return rows.insertId;
        } catch (error) {
            console.log('[Server]: user could not be suspended, ' + email + ', ' + error);
        }
        return -1;
    }

    /**
     * Unsuspends a user in the database.
     * @param {string} email - The email address of the user to be unsuspended.
     * @returns {Promise<number>} A Promise that resolves to the ID of the unsuspended user.
     */
    async unsuspend(email: string): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('UPDATE users SET suspended = 0 WHERE email = ?', [email]);

            console.log('[Server]: user unsuspended, ' + email);
            return rows.insertId;
        } catch (error) {
            console.log('[Server]: user could not be unsuspended, ' + email + ', ' + error);
        }
        return -1;
    }

    /**
     * Adds a login attempt record for a user in the database.
     * @param {number} user_id - The ID of the user.
     * @param {string} password - The password used in the login attempt.
     * @param {boolean} successful - Indicates whether the login attempt was successful or not.
     * @param {string} [ipAddress] - The IP address from which the login attempt was made.
     * @returns {Promise<void>} A Promise that resolves when the login attempt record is added.
     */
    async addLoginAttempt(user_id: number, password: string, successful: boolean, ipAddress?: string): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('INSERT INTO login_attempts (user_id, password, ip_address, successful) VALUES (?, ?, ?, ?)',
                [user_id, password, ipAddress, successful]);

            console.log('[Server]: login attempt added, ' + user_id);
        } catch (error) {
            console.log('[Server]: login attempt could not be added, ' + user_id + ', ' + error);
        }
    }

    /**
     * Gets all users from the database.
     * @returns {Promise<User[]>} A Promise that resolves to an array of User objects.
     */
    async getUsers(): Promise<User[]> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM users');
            return rows as User[];
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    /**
     * Gets all users created between the specified dates from the database.
     * @param {Date} from - The start date of the range.
     * @param {Date} to - The end date of the range.
     * @returns {Promise<User[]>} A Promise that resolves to an array of User objects.
     */
    async getUsersBetweenDate(from: Date, to: Date): Promise<User[]> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM users WHERE created_at BETWEEN ? AND ?', [from, to]);
            return rows as User[];
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    /**
     * Gets all staff users (admins, managers, booking clerks, invoice clerks) from the database.
     * @returns {Promise<User[]>} A Promise that resolves to an array of User objects.
     */
    async getStaff(): Promise<User[]> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM users WHERE role = "admin" OR role = "manager" OR role = "booking clerk" OR role = "invoice clerk"');
            return rows as User[];
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    /**
     * Gets all admin users from the database.
     * @returns {Promise<User[]>} A Promise that resolves to an array of User objects.
     */
    async getAdmins(): Promise<User[]> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM users WHERE role = "admin"');
            return rows as User[];
        } catch (error) {
            console.log(error);
        }
        return [];
    }
}

class User {
    /**
     * User email.
     */
    email: string;
    /**
     * User password.
     */
    password: string;
    /**
     * Optional remember token.
     */
    remember_token?: string;
    /**
     * User role.
     */
    role: string;
    /**
     * User telephone number.
     */
    telephone?: string;
    /**
     * Address line one.
     */
    addressLineOne?: string;
    /**
     * Address line two.
     */
    addressLineTwo?: string;
    /**
     * City of residence.
     */
    city?: string;
    /**
     * Region or state of residence.
     */
    region?: string;
    /**
     * ZIP or postal code.
     */
    zip?: string;
    /**
     * Country of residence.
     */
    country?: string;
    /**
     * ID of the user who created this user.
     */
    created_by_user_id?: number;
    /**
     * Date when the user was created.
     */
    created_at?: Date;
    /**
     * ID of the user who last updated this user.
     */
    updated_by_user_id?: number;
    /**
     * Date when the user was last updated.
     */
    updated_at?: Date;
    /**
     * Indicates whether the user is suspended.
     */
    suspended?: boolean;

    /**
     * Creates a new User instance.
     * @param {string} email - User email.
     * @param {string} password - User password.
     * @param {string} role - User role.
     * @param {string} [remember_token] - Optional remember token.
     * @param {string} [telephone] - User telephone number.
     * @param {string} [addressLineOne] - Address line one.
     * @param {string} [addressLineTwo] - Address line two.
     * @param {string} [city] - City of residence.
     * @param {string} [region] - Region or state of residence.
     * @param {string} [zip] - ZIP or postal code.
     * @param {string} [country] - Country of residence.
     * @param {number} [created_by_user_id] - ID of the user who created this user.
     * @param {Date} [created_at] - Date when the user was created.
     * @param {number} [updated_by_user_id] - ID of the user who last updated this user.
     * @param {Date} [updated_at] - Date when the user was last updated.
     * @param {boolean} [suspended] - Indicates whether the user is suspended.
     */
    constructor(
        email: string,
        password: string,
        role: string,
        remember_token?: string,
        telephone?: string,
        addressLineOne?: string,
        addressLineTwo?: string,
        city?: string,
        region?: string,
        zip?: string,
        country?: string,
        created_by_user_id?: number,
        created_at?: Date,
        updated_by_user_id?: number,
        updated_at?: Date,
        suspended?: boolean
    ) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.remember_token = remember_token;
        this.telephone = telephone;
        this.addressLineOne = addressLineOne;
        this.addressLineTwo = addressLineTwo;
        this.city = city;
        this.region = region;
        this.zip = zip;
        this.country = country;
        this.created_by_user_id = created_by_user_id;
        this.created_at = created_at;
        this.updated_by_user_id = updated_by_user_id;
        this.updated_at = updated_at;
        this.suspended = suspended;
    }

    /**
     * Get the user's email.
     * @returns {string} The user's email.
     */
    getEmail(): string {
        return this.email;
    }

    /**
     * Get the user's password.
     * @returns {string} The user's password.
     */
    getPassword(): string {
        return this.password;
    }

    /**
     * Get the user's remember token, if available.
     * @returns {string | undefined} The user's remember token, or undefined if not set.
     */
    getRememberToken(): string | undefined {
        return this.remember_token;
    }

    /**
     * Get the user's role.
     * @returns {string} The user's role.
     */
    getRole(): string {
        return this.role;
    }

    /**
     * Get the user's telephone number, if available.
     * @returns {string | undefined} The user's telephone number, or undefined if not set.
     */
    getTelephone(): string | undefined {
        return this.telephone;
    }

    /**
     * Get the user's address line one, if available.
     * @returns {string | undefined} The user's address line one, or undefined if not set.
     */
    getAddressLineOne(): string | undefined {
        return this.addressLineOne;
    }

    /**
     * Get the user's address line two, if available.
     * @returns {string | undefined} The user's address line two, or undefined if not set.
     */
    getAddressLineTwo(): string | undefined {
        return this.addressLineTwo;
    }

    /**
     * Get the user's city of residence, if available.
     * @returns {string | undefined} The user's city, or undefined if not set.
     */
    getCity(): string | undefined {
        return this.city;
    }

    /**
     * Get the user's region or state of residence, if available.
     * @returns {string | undefined} The user's region or state, or undefined if not set.
     */
    getRegion(): string | undefined {
        return this.region;
    }

    /**
     * Get the user's ZIP or postal code, if available.
     * @returns {string | undefined} The user's ZIP or postal code, or undefined if not set.
     */
    getZip(): string | undefined {
        return this.zip;
    }

    /**
     * Get the user's country of residence, if available.
     * @returns {string | undefined} The user's country, or undefined if not set.
     */
    getCountry(): string | undefined {
        return this.country;
    }

    /**
     * Get the ID of the user who created this user, if available.
     * @returns {number | undefined} The ID of the user who created this user, or undefined if not set.
     */
    getCreatedByUserId(): number | undefined {
        return this.created_by_user_id;
    }

    /**
     * Get the date when the user was created, if available.
     * @returns {Date | undefined} The date when the user was created, or undefined if not set.
     */
    getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    /**
     * Get the ID of the user who last updated this user, if available.
     * @returns {number | undefined} The ID of the user who last updated this user, or undefined if not set.
     */
    getUpdatedByUserId(): number | undefined {
        return this.updated_by_user_id;
    }

    /**
     * Get the date when the user was last updated, if available.
     * @returns {Date | undefined} The date when the user was last updated, or undefined if not set.
     */
    getUpdatedAt(): Date | undefined {
        return this.updated_at;
    }

    /**
     * Get whether the user is suspended.
     * @returns {boolean | undefined} True if the user is suspended, false otherwise.
     */
    getSuspended(): boolean | undefined {
        return this.suspended;
    }

    /**
     * Set the user's email.
     * @param {string} email - The user's email.
     */
    setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Set the user's password.
     * @param {string} password - The user's password.
     */
    setPassword(password: string): void {
        this.password = password;
    }

    /**
     * Set the user's remember token.
     * @param {string} remember_token - The user's remember token.
     */
    setRememberToken(remember_token: string): void {
        this.remember_token = remember_token;
    }

    /**
     * Set the user's role.
     * @param {string} role - The user's role.
     */
    setRole(role: string): void {
        this.role = role;
    }

    /**
     * Set the user's telephone number.
     * @param {string} telephone - The user's telephone number.
     */
    setTelephone(telephone: string): void {
        this.telephone = telephone;
    }

    /**
     * Set the user's address line one.
     * @param {string} addressLineOne - The user's address line one.
     */
    setAddressLineOne(addressLineOne: string): void {
        this.addressLineOne = addressLineOne;
    }

    /**
     * Set the user's address line two.
     * @param {string} addressLineTwo - The user's address line two.
     */
    setAddressLineTwo(addressLineTwo: string): void {
        this.addressLineTwo = addressLineTwo;
    }

    /**
     * Set the user's city of residence.
     * @param {string} city - The user's city of residence.
     */
    setCity(city: string): void {
        this.city = city;
    }

    /**
     * Set the user's region or state of residence.
     * @param {string} region - The user's region or state of residence.
     */
    setRegion(region: string): void {
        this.region = region;
    }

    /**
     * Set the user's ZIP or postal code.
     * @param {string} zip - The user's ZIP or postal code.
     */
    setZip(zip: string): void {
        this.zip = zip;
    }

    /**
     * Set the user's country of residence.
     * @param {string} country - The user's country of residence.
     */
    setCountry(country: string): void {
        this.country = country;
    }

    /**
     * Set the ID of the user who created this user.
     * @param {number} created_by_user_id - The ID of the user who created this user.
     */
    setCreatedByUserId(created_by_user_id: number): void {
        this.created_by_user_id = created_by_user_id;
    }

    /**
     * Set the date when the user was created.
     * @param {Date} created_at - The date when the user was created.
     */
    setUpdatedByUserId(updated_by_user_id: number): void {
        this.updated_by_user_id = updated_by_user_id;
    }

    /**
     * Set the ID of the user who last updated this user.
     * @param {number} updated_by_user_id - The ID of the user who last updated this user.
     */
    setSuspended(suspended: boolean): void {
        this.suspended = suspended;
    }

    /**
     * Set the date when the user was last updated.
     * @param {Date} updated_at - The date when the user was last updated.
     * @returns {User[]} An array of Users.
     */
    static async getUsers(): Promise<User[]> {
        return await new UserDAO().getUsers();
    }

    /**
     * Get all users created between the specified dates.
     * @param {Date} from - The start date of the range.
     * @param {Date} to - The end date of the range.
     * @returns {User[]} An array of Users. 
     */
    static async getUsersBetweenDate(from: Date, to: Date): Promise<User[]> {
        return await new UserDAO().getUsersBetweenDate(from, to);
    }

    /**
     * Get all staff users (admins, managers, booking clerks, invoice clerks).
     * @returns {User[]} An array of Users.
     */
    static async getStaff(): Promise<User[]> {
        return await new UserDAO().getStaff();
    }

    /**
     * Get all admin users.
     * @returns {User[]} An array of Users.
     */
    static async getAdmins(): Promise<User[]> {
        return await new UserDAO().getAdmins();
    }

    /**
     * Finds a user by their email address.
     * @param {string} email - The email address of the user.
     * @returns {Promise<User | null>} A Promise that resolves to the User object if found, or null if not found.
     */
    static async findByEmail(email: string): Promise<User | null> {
        return await new UserDAO().findByEmail(email);
    }

    /**
     * Finds a user by their ID.
     * @param {number} id - The ID of the user.
     * @returns {Promise<User | null>} A Promise that resolves to the User object if found, or null if not found.
     */
    static async findByID(id: number): Promise<User | null> {
        return await new UserDAO().findByID(id);
    }

    /**
     * Checks if a user is marked as deleted in the database.
     * @param {string} email - The email address of the user.
     * @returns {Promise<boolean>} A Promise that resolves to true if the user is deleted, or false otherwise.
     */
    static async isDeleted(email: string): Promise<boolean> {
        return await new UserDAO().isDeleted(email);
    }

    /**
     * Gets the user ID for a given email address.
     * @param {string} email - The email address of the user.
     * @returns {Promise<number | null>} A Promise that resolves to the user ID if found, or null if not found.
     */
    static async getUserID(email: string): Promise<number | null> {
        return await new UserDAO().getUserID(email);
    }

    /**
     * Creates a new user in the database.
     * @param {User} user - The user object containing the user details.
     * @returns {Promise<number>} A Promise that resolves to the ID of the created user.
     */
    static async create(user: User): Promise<number> {
        return await new UserDAO().create(user);
    }

    /**
     * Updates an existing user in the database.
     * @param {User} user - The user object containing the updated user details.
     * @returns {Promise<number>} A Promise that resolves to the ID of the updated user.
     */
    static async update(user: User): Promise<number> {
        return await new UserDAO().update(user);
    }

    /**
     * Deletes a user from the database.
     * @param {string} email - The email address of the user to be deleted.
     * @returns {Promise<number>} A Promise that resolves to the ID of the deleted user.
     */
    static async delete(email: string): Promise<number> {
        return await new UserDAO().delete(email);
    }

    /**
     * Suspends a user in the database.
     * @param {string} email - The email address of the user to be suspended.
     * @returns {Promise<number>} A Promise that resolves to the ID of the suspended user.
     */
    static async suspend(email: string): Promise<number> {
        return await new UserDAO().suspend(email);
    }

    /**
     * Unsuspends a user in the database.
     * @param {string} email - The email address of the user to be unsuspended.
     * @returns {Promise<number>} A Promise that resolves to the ID of the unsuspended user.
     */
    static async unsuspend(email: string): Promise<number> {
        return await new UserDAO().unsuspend(email);
    }

    /**
     * Adds a login attempt record for a user in the database.
     * @param {number} user_id - The ID of the user.
     * @param {string} password - The password used in the login attempt.
     * @param {boolean} successful - Indicates whether the login attempt was successful or not.
     * @param {string} [ipAddress] - The IP address from which the login attempt was made.
     * @returns {Promise<void>} A Promise that resolves when the login attempt record is added.
     */
    static async addLoginAttempt(user_id: number, password: string, successful: boolean, ipAddress?: string): Promise<void> {
        await new UserDAO().addLoginAttempt(user_id, password, successful, ipAddress);
    }

}

export default User;