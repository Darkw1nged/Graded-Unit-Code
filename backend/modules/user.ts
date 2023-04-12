import { getConnection } from '../database';
import { PoolConnection, RowDataPacket, OkPacket } from 'mysql2/promise';
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
        const connection = await getConnection() as PoolConnection;

        // Try and query the database
        try {

            // We need to check if an address was provided.
            // Before we can we need to create a variable to store the address ID.
            let addressID = null;

            // If an address was provided, we need to check if it already exists in the database.
            if (address) {
                const [rows] = await connection.query<RowDataPacket[]>(
                    'SELECT id FROM addresses WHERE addressLineOne = ? AND `postcode` = ?',
                    [address.addressLineOne, address.postcode]
                );
    
                // If an address was not found, we need to create a new one.
                if (rows.length === 0) {
                    const { addressLineOne, addressLineTwo, city, country, postcode } = address;
                
                    const result = await connection.query<OkPacket>(
                        'INSERT INTO addresses (addressLineOne, addressLineTwo, city, country, postcode) VALUES (?, ?, ?, ?, ?)',
                        [addressLineOne, addressLineTwo, city, country, postcode]
                    );
                
                    addressID = result[0].insertId;
                } else {
                    addressID = rows[0].id;
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
     * @memberof User
     * @description This function finds a user by their email address.
     * @param email The user's email address.
     * @returns The found user, or null if no user was found.
     */
    static async findByEmail(email: string): Promise<User | null> {
        // Get a connection from the pool
        const connection = await getConnection() as PoolConnection;

        // Try and query the database
        try {
            // Query the database for the user
            const [rows] = await connection.query<RowDataPacket[]>(
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
    
}
