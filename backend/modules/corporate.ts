import pool from '../database';
import Address from './address';

/**
 * Represents a corporate.
 * @class
 * @description This is the class that represents a corporate.
 * @memberof backend
 * @property {string} name The corporate's name.
 * @property {string} email The corporate's email address.
 * @property {string} password The corporate's password.
 * @property {string} telephone The corporate's telephone number.
 * @property {Address} address The corporate's address.
 */
export default class Corporate {
    /**
     * The corporate's name.
     * @type {string}
     * @memberof Corporate
     * @description This is the name that the corporate will be recognised by.
     */
    name: string;

    /**
     * The corporate's email address.
     * @type {string}
     * @memberof Corporate
     * @description This is the email address that the corporate will use to log in to the system.
     */
    email: string;

    /**
     * The corporate's password.
     * @type {string}
     * @memberof Corporate
     * @description This is the password that the corporate will use to log in to the system.
     */
    password: string;

    /**
     * The corporate's telephone number.
     * @type {string}
     * @memberof Corporate
     * @description This is the telephone number that the ParkEasy team can use to contact the corporate.
     */
    telephone: string;

    /**
     * The corporate's address.
     * @type {Address}
     * @memberof Corporate
     * @description This is where the corporate is located.
     */
    address: Address;

    /**
     * The constructor for the Corporate class.
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {string} telephone
     * @param {Address} address
     * @memberof Corporate
     * @description This is the constructor for the Corporate class.
     */
    constructor(name: string, email: string, password: string, telephone: string, address: Address) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.telephone = telephone;
        this.address = address;
    }

    /**
     * The method that creates a new corporate.
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {string} telephone
     * @param {Address} address
     * @returns {Promise<void>}
     * @memberof Corporate
     * @description This method creates a new corporate.
     */
    static async create(
        name: string,
        email: string,
        password: string,
        telephone: string,
        address?: Address
    ): Promise<void> {
        // Get a connection from the pool.
        const connection = await pool.getConnection();

        // Try and query the database.
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

            // Now we can create the corporate.
            await connection.query(
                'INSERT INTO `corporate` (`name`, `email`, `password`, `telephone`, `addressID`) VALUES (?, ?, ?, ?, ?)',
                [name, email, password, telephone, addressID.id]
            );
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }        
    }

}