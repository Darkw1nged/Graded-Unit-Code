import * as MySqlConnector from '../utils/mysql.connector';
import { OkPacket, RowDataPacket } from 'mysql2';

/**
 * Represents the Extra Data Access Object (DAO) for accessing extras in the database.
 */
class ExtraDAO {

    /**
     * Retrieves an Extra object from the database based on the provided booking ID.
     * @param {number} booking_id - The ID of the booking.
     * @returns {Promise<Extra | null>} A Promise that resolves to the Extra object, or null if not found.
     */
    async get(booking_id: number): Promise<Extra | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM extras WHERE booking_id = ?', [booking_id]);
            return rows[0] as Extra;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all Extra objects from the database.
     * @returns {Promise<Extra[] | null>} A Promise that resolves to an array of Extra objects, or null if none found.
     */
    async getAll(): Promise<Extra[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM extras');
            return rows as Extra[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Creates a new Extra record in the database.
     * @param {Extra} extras - The Extra object to create.
     * @returns {Promise<number | null>} A Promise that resolves to the ID of the newly created Extra record, or null if creation fails.
     */
    async create(extras: Extra): Promise<number | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('INSERT INTO extras (booking_id, mini_valet, full_valet, signature_valet) VALUES (?, ?, ?, ?)',
                [extras.getBookingID(), extras.getMiniValet(), extras.getFullValet(), extras.getSignatureValet()]);

            console.log('[Server]: extras created, ' + extras.getBookingID());
            return rows.insertId;
        } catch (error) {
            console.log('[Server]: error creating extras, ' + error)
        }
        return null;
    }

    /**
     * Updates an existing Extra record in the database.
     * @param {Extra} extras - The Extra object with updated values.
     * @returns {Promise<void>} A Promise that resolves when the update operation is completed.
     */
    async update(extras: Extra): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            await pool.query('UPDATE extras SET mini_valet = ?, full_valet = ?, signature_valet = ? WHERE booking_id = ?',
                [extras.mini_valet, extras.full_valet, extras.signature_valet, extras.booking_id]);

            console.log('[Server]: extras updated, ' + extras.booking_id);
        } catch (error) {
            console.log('[Server]: error updating extras, ' + error)
        }
    }

}

/**
 * Represents an Extra object.
 */
class Extra {

    booking_id: number;
    mini_valet: boolean;
    full_valet: boolean;
    signature_valet: boolean;

    /**
     * Creates a new Extra object.
     * @param {number} booking_id - The ID of the booking.
     * @param {boolean} mini_valet - Whether mini valet is included.
     * @param {boolean} full_valet - Whether full valet is included.
     * @param {boolean} signature_valet - Whether signature valet is included.
     */
    constructor(booking_id: number, mini_valet: boolean, full_valet: boolean, signature_valet: boolean) {
        this.booking_id = booking_id;
        this.mini_valet = mini_valet;
        this.full_valet = full_valet;
        this.signature_valet = signature_valet;
    }

    /**
     * Retrieves the booking ID of the Extra.
     * @returns {number} The booking ID.
     */
    getBookingID(): number {
        return this.booking_id;
    }

    /**
     * Retrieves whether mini valet is included in the Extra.
     * @returns {boolean} True if mini valet is included, false otherwise.
     */
    getMiniValet(): boolean {
        return this.mini_valet;
    }

    /**
     * Retrieves whether full valet is included in the Extra.
     * @returns {boolean} True if full valet is included, false otherwise.
     */
    getFullValet(): boolean {
        return this.full_valet;
    }

    /**
     * Retrieves whether signature valet is included in the Extra.
     * @returns {boolean} True if signature valet is included, false otherwise.
     */
    getSignatureValet(): boolean {
        return this.signature_valet;
    }

    /**
     * Sets the booking ID of the Extra.
     * @param {number} booking_id - The booking ID to set.
     */
    setBookingID(booking_id: number): void {
        this.booking_id = booking_id;
    }

    /**
     * Sets whether mini valet is included in the Extra.
     * @param {boolean} mini_valet - Whether mini valet is included.
     */
    setMiniValet(mini_valet: boolean): void {
        this.mini_valet = mini_valet;
    }

    /**
     * Sets whether full valet is included in the Extra.
     * @param {boolean} full_valet - Whether full valet is included.
     */
    setFullValet(full_valet: boolean): void {
        this.full_valet = full_valet;
    }

    /**
     * Sets whether signature valet is included in the Extra.
     * @param {boolean} signature_valet - Whether signature valet is included.
     */
    setSignatureValet(signature_valet: boolean): void {
        this.signature_valet = signature_valet;
    }

    /**
     * Retrieves an Extra object from the database based on the provided booking ID.
     * @param {number} booking_id - The ID of the booking.
     * @returns {Promise<Extra | null>} A Promise that resolves to the Extra object, or null if not found.
     */
    static async get(booking_id: number): Promise<Extra | null> {
        return new ExtraDAO().get(booking_id);
    }

    /**
     * Retrieves all Extra objects from the database.
     * @returns {Promise<Extra[] | null>} A Promise that resolves to an array of Extra objects, or null if none found.
     */
    static async getAll(): Promise<Extra[] | null> {
        return new ExtraDAO().getAll();
    }

    /**
     * Creates a new Extra record in the database.
     * @param {Extra} extras - The Extra object to create.
     * @returns {Promise<number | null>} A Promise that resolves to the ID of the newly created Extra record, or null if creation fails.
     */
    static async create(extras: Extra): Promise<number | null> {
        return new ExtraDAO().create(extras);
    }

    /**
     * Updates an existing Extra record in the database.
     * @param {Extra} extras - The Extra object with updated values.
     * @returns {Promise<void>} A Promise that resolves when the update operation is completed.
     */
    static async update(extras: Extra): Promise<void> {
        return new ExtraDAO().update(extras);
    }

}

export default Extra;