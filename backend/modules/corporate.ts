import { getConnection } from '../database';
import { PoolConnection, RowDataPacket, OkPacket } from 'mysql2/promise';
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
     * The corporate's role (Role ID).
     * @type {number}
     * @memberof Corporate
     * @description This is the role that the corporate has.
     */
    roleID: number;

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
    constructor(name: string, email: string, password: string, roleID: number, telephone: string, address: Address) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.roleID = roleID;
        this.telephone = telephone;
        this.address = address;
    }

    /**
     * The method that creates a new corporate.
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {number} roleID
     * @param {string} telephone
     * @param {Address} address
     * @returns {Promise<void>}
     * @memberof Corporate
     * @description This method creates a new corporate.
     */
    static async createCorporate(
        name: string,
        email: string,
        password: string,
        roleID: number,
        telephone: string,
        address?: Address
    ): Promise<void> {
        // Get a connection from the pool.
        const connection = await getConnection() as PoolConnection;

        // Try and query the database.
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

            // Now we can create the corporate.
            await connection.query(
                'INSERT INTO `corporate` (`email`, `password`, `roleID`, `name`, `telephone`, `addressID`) VALUES (?, ?, ?, ?, ?, ?)',
                [email, password, roleID, name, telephone, addressID.id]
            );
        } finally {
            connection.release();
        }        
    }

    /**
     * The method that gets a corporate by their email address.
     * @param {string} email
     * @returns {Promise<Corporate>}
     * @memberof Corporate
     * @description This method gets a corporate by their email address.
     */
    static async findByEmail(email: string): Promise<Corporate | null> {
        // Get a connection from the pool.
        const connection = await getConnection() as PoolConnection;

        // Try and query the database.
        try {
            // Query the database for the corporate.
            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM `corporate` WHERE `email` = ?',
                [email]
            );

            // If a corporate was found, we need to return it.
            if (rows.length > 0) {
                return new Corporate(
                    rows[0].name,
                    rows[0].email,
                    rows[0].password,
                    rows[0].roleID,
                    rows[0].telephone,
                    rows[0].addressID
                );
            }

            // If no corporate was found, we need to return null.
            return null;
        } finally {
            connection.release();
        }
    }

}