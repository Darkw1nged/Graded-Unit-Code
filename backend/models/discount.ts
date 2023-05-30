import { OkPacket, RowDataPacket } from 'mysql2';
import * as MySqlConnector from '../utils/mysql.connector';

/**
 * Data Access Object (DAO) for handling discounts.
 */
class DiscountDAO {

    /**
     * Retrieves a discount by its code.
     * @param {string} code - The discount code.
     * @returns {Promise<Discount | null>} A promise that resolves to the found discount or null if not found.
     */
    async get(code: string): Promise<Discount | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM discounts WHERE discount_code = ?', [code]);
            return rows[0] as Discount;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all discounts.
     * @returns {Promise<Discount[] | null>} A promise that resolves to an array of discounts or null if none found.
     */
    async getAll(): Promise<Discount[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM discounts');
            return rows as Discount[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves the ID of a discount by its code.
     * @param {string} code - The discount code.
     * @returns {Promise<number | null>} A promise that resolves to the ID of the discount or null if not found.
     */
    async getDiscountID(code: string): Promise<number | null> {
        if (code == undefined || code == '' || code == null) return null;

        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM discounts WHERE discount_code = ?', [code.trim()]);
            return rows[0].id as number;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Creates a new discount.
     * @param {Discount} discount - The discount object to be created.
     * @returns {Promise<void>} A promise that resolves when the discount is successfully created.
     */
    async create(discount: Discount): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('INSERT INTO discounts (discount_name, discount_code, discount_amount, disabled) VALUES (?, ?, ?, ?)', [
                discount.getDiscountName(), discount.getDiscountCode(), discount.getDiscountAmount(), discount.getDisabled()
            ]);
            console.log('[Server]: discount created, ' + discount.getDiscountCode());
        } catch (error) {
            console.log('[Server]: discount could not be created, ' + discount.getDiscountCode() + ', ' + error);
        }
    }

    /**
     * Updates an existing discount.
     * @param {Discount} discount - The discount object to be updated.
     * @returns {Promise<void>} A promise that resolves when the discount is successfully updated.
     */
    async update(discount: Discount): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('UPDATE discounts SET discount_name = ?, discount_code = ?, discount_amount = ?, disabled = ? WHERE discount_code = ?',
                [discount.discount_name, discount.discount_code, discount.discount_amount, discount.disabled, discount.discount_code]
            );
            console.log('[Server]: discount updated, ' + discount.discount_code);
        } catch (error) {
            console.log('[Server]: discount could not be updated, ' + discount.discount_code + ', ' + error);
        }
    }

    /**
     * Deletes a discount by its code.
     * @param {string} discount_code - The discount code.
     * @returns {Promise<void>} A promise that resolves when the discount is successfully deleted.
     */
    async delete(discount_code: string): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('DELETE FROM discounts WHERE discount_code = ?', [discount_code]);
            console.log('[Server]: discount deleted, ' + discount_code);
        } catch (error) {
            console.log('[Server]: discount could not be deleted, ' + discount_code + ', ' + error);
        }
    }

}

/**
 * Represents a discount.
 */
class Discount {
    /**
     * The name of the discount.
     */
    discount_name: string;
    /**
     * The code associated with the discount.
     */
    discount_code: string;
    /**
     * The amount of the discount.
     */
    discount_amount: number;
    /**
     * Indicates whether the discount is disabled or not.
     */
    disabled: boolean;
    /**
     * The creation date of the discount (optional).
     */
    created_at?: Date;
    /**
     * The last update date of the discount (optional).
     */
    updated_at?: Date;

    /**
     * Creates a new instance of the Discount class.
     * @param {string} discount_name - The name of the discount.
     * @param {string} discount_code - The code associated with the discount.
     * @param {number} discount_amount - The amount of the discount.
     * @param {boolean} disabled - Indicates whether the discount is disabled or not.
     * @param {Date} [created_at] - The creation date of the discount (optional).
     * @param {Date} [updated_at] - The last update date of the discount (optional).
     */
    constructor(
        discount_name: string,
        discount_code: string,
        discount_amount: number,
        disabled: boolean,
        created_at?: Date,
        updated_at?: Date
    ) {
        this.discount_name = discount_name;
        this.discount_code = discount_code;
        this.discount_amount = discount_amount;
        this.disabled = disabled;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Returns the name of the discount.
     * @returns {string} The name of the discount.
     */
    getDiscountName(): string {
        return this.discount_name;
    }

    /**
     * Returns the code associated with the discount.
     * @returns {string} The code associated with the discount.
     */
    getDiscountCode(): string {
        return this.discount_code;
    }

    /**
     * Returns the amount of the discount.
     * @returns {number} The amount of the discount.
     */
    getDiscountAmount(): number {
        return this.discount_amount;
    }

    /**
     * Indicates whether the discount is disabled or not.
     * @returns {boolean} True if the discount is disabled, false otherwise.
     */
    getDisabled(): boolean {
        return this.disabled;
    }

    /**
     * Returns the creation date of the discount.
     * @returns {Date | undefined} The creation date of the discount, or undefined if not set.
     */
    getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    /**
     * Returns the last update date of the discount.
     * @returns {Date | undefined} The last update date of the discount, or undefined if not set.
     */
    getUpdatedAt(): Date | undefined {
        return this.updated_at;
    }

    /**
     * Sets the name of the discount.
     * @param {string} discount_name - The new name of the discount.
     */
    setDiscountName(discount_name: string): void {
        this.discount_name = discount_name;
    }

    /**
     * Sets the code associated with the discount.
     * @param {string} discount_code - The new code associated with the discount.
     */
    setDiscountCode(discount_code: string): void {
        this.discount_code = discount_code;
    }

    /**
     * Sets the amount of the discount.
     * @param {number} discount_amount - The new amount of the discount.
     */
    setDiscountAmount(discount_amount: number): void {
        this.discount_amount = discount_amount;
    }

    /**
     * Sets whether the discount is disabled or not.
     * @param {boolean} disabled - The new disabled status of the discount.
     */
    setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }

    /**
     * Sets the creation date of the discount.
     * @param {Date} created_at - The new creation date of the discount.
     */
    setCreatedAt(created_at: Date): void {
        this.created_at = created_at;
    }

    /**
     * Sets the last update date of the discount.
     * @param {Date} updated_at - The new last update date of the discount.
     */
    setUpdatedAt(updated_at: Date): void {
        this.updated_at = updated_at;
    }

    /**
     * Retrieves a discount based on its code.
     * @param {string} code - The discount code.
     * @returns {Promise<Discount | null>} A Promise that resolves with the retrieved discount, or null if not found.
     */
    static async get(code: string): Promise<Discount | null> {
        return new DiscountDAO().get(code);
    }

    /**
     * Retrieves all discounts.
     * @returns {Promise<Discount[] | null>} A Promise that resolves with an array of all discounts, or null if not found.
     */
    static async getAll(): Promise<Discount[] | null> {
        return new DiscountDAO().getAll();
    }

    /**
     * Retrieves the ID of a discount based on its code.
     * @param {string} code - The discount code.
     * @returns {Promise<number | null>} A Promise that resolves with the ID of the discount, or null if not found.
     */
    static async getDiscountID(code: string): Promise<number | null> {
        return new DiscountDAO().getDiscountID(code);
    }

    /**
     * Creates a new discount.
     * @param {Discount} discount - The discount to create.
     * @returns {Promise<void>} A Promise that resolves when the discount is created.
     */
    static async create(discount: Discount): Promise<void> {
        return new DiscountDAO().create(discount);
    }

    /**
     * Updates an existing discount.
     * @param {Discount} discount - The discount to update.
     * @returns {Promise<void>} A Promise that resolves when the discount is updated.
     */
    static async update(discount: Discount): Promise<void> {
        return new DiscountDAO().update(discount);
    }

    /**
     * Deletes a discount based on its code.
     * @param {string} discount_code - The discount code.
     * @returns {Promise<void>} A Promise that resolves when the discount is deleted.
     */
    static async delete(discount_code: string): Promise<void> {
        return new DiscountDAO().delete(discount_code);
    }
}

export default Discount;