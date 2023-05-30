import { OkPacket, RowDataPacket } from 'mysql2';
import * as MySqlConnector from '../utils/mysql.connector';

/**
 * Represents a Data Access Object (DAO) for the Business entity.
 */
class BusinessDAO {
    /**
     * Retrieves a Business object by user ID.
     * @param {number} user_id - The ID of the user.
     * @returns {Promise<Business | null>} A promise that resolves to the retrieved Business object, or null if not found.
     */
    async getByUserID(user_id: number): Promise<Business | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM business WHERE user_id = ?', [user_id]);
            return rows[0] as Business;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Creates a new Business object.
     * @param {Business} business - The Business object to create.
     * @returns {Promise<number>} A promise that resolves to the ID of the newly created Business object.
     */
    async create(business: Business): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>(
                'INSERT INTO business (user_id, name, slogan, description) VALUES (?, ?, ?, ?)',
                [business.user_id, business.name, business.slogan, business.description]
            );
            return rows.insertId;
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    /**
     * Updates an existing Business object.
     * @param {Business} business - The Business object to update.
     * @param {string} email - The email associated with the user.
     * @returns {Promise<number>} A promise that resolves to the ID of the updated Business object.
     */
    async update(business: Business, email: string): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();

            const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
            const id = rows[0].id;

            await pool.query<OkPacket>(
                'UPDATE business SET name = ?, slogan = ?, description = ? WHERE user_id = ?',
                [business.name, business.slogan, business.description, business.user_id]
            );
            return id;
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    /**
     * Retrieves all Business objects.
     * @returns {Promise<Business[]>} A promise that resolves to an array of Business objects.
     */
    async getBusiness(): Promise<Business[]> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows, fields] = await pool.query('SELECT * FROM business');
            return rows as Business[];
        } catch (error) {
            console.log(error);
        }
        return [];
    }
}

/**
 * Represents a business entity.
 */
class Business {
    /**
     * The user ID associated with the business.
     */
    user_id: number;

    /**
     * The name of the business.
     */
    name: string;

    /**
     * The slogan of the business (optional).
     */
    slogan?: string;

    /**
     * The description of the business (optional).
     */
    description?: string;

    /**
     * Creates a new instance of the Business class.
     * @param {number} user_id - The user ID associated with the business.
     * @param {string} name - The name of the business.
     * @param {string} [slogan] - The slogan of the business (optional).
     * @param {string} [description] - The description of the business (optional).
     */
    constructor(
        user_id: number,
        name: string,
        slogan?: string,
        description?: string
    ) {
        this.user_id = user_id;
        this.name = name;
        this.slogan = slogan;
        this.description = description;
    }

    /**
     * Gets the user ID associated with the business.
     * @returns {number} The user ID.
     */
    getUserID(): number {
        return this.user_id;
    }

    /**
     * Gets the name of the business.
     * @returns {string} The name.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Gets the slogan of the business, if available.
     * @returns {string | undefined} The slogan or undefined if not provided.
     */
    getSlogan(): string | undefined {
        return this.slogan;
    }

    /**
     * Gets the description of the business, if available.
     * @returns {string | undefined} The description or undefined if not provided.
     */
    getDescription(): string | undefined {
        return this.description;
    }

    /**
     * Sets the user ID associated with the business.
     * @param {number} user_id - The user ID to set.
     */
    setUserID(user_id: number): void {
        this.user_id = user_id;
    }

    /**
     * Sets the name of the business.
     * @param {string} name - The name to set.
     */
    setName(name: string): void {
        this.name = name;
    }

    /**
     * Sets the slogan of the business.
     * @param {string} slogan - The slogan to set.
     */
    setSlogan(slogan: string): void {
        this.slogan = slogan;
    }

    /**
     * Sets the description of the business.
     * @param {string} description - The description to set.
     */
    setDescription(description: string): void {
        this.description = description;
    }

    /**
     * Retrieves a business by its user ID.
     * @param {number} user_id - The user ID to search for.
     * @returns {Promise<Business | null>} A promise that resolves to the Business instance, or null if not found.
     */
    static async getByUserID(user_id: number): Promise<Business | null> {
        return await new BusinessDAO().getByUserID(user_id);
    }

    /**
     * Retrieves all businesses.
     * @returns {Promise<Business[]>} A promise that resolves to an array of Business instances.
     */
    static async getBusiness(): Promise<Business[]> {
        return await new BusinessDAO().getBusiness();
    }

    /**
     * Creates a new business.
     * @param {Business} business - The business to create.
     * @returns {Promise<number>} A promise that resolves to the ID of the created business.
     */
    static async create(business: Business): Promise<number> {
        return await new BusinessDAO().create(business);
    }

    /**
     * Updates an existing business.
     * @param {Business} business - The updated business object.
     * @param {string} email - The email associated with the business.
     * @returns {Promise<number>} A promise that resolves to the number of updated rows.
     */
    static async update(business: Business, email: string): Promise<number> {
        return await new BusinessDAO().update(business, email);
    }
}

export default Business;