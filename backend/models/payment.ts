import { OkPacket, RowDataPacket } from 'mysql2';
import * as MySqlConnector from '../utils/mysql.connector';

/**
 * Represents a Payment Data Access Object (DAO) for interacting with the database.
 */
class PaymentDAO {
    /**
     * Retrieves a payment by CVV.
     * @param {number} cvv - The CVV of the payment.
     * @returns {Promise<Payment | null>} A Promise that resolves to the Payment object if found, or null if not found.
     */
    async get(cvv: number): Promise<Payment | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM payments WHERE cvv = ?', [cvv]);
            return rows[0] as Payment;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all payments.
     * @returns {Promise<Payment[] | null>} A Promise that resolves to an array of Payment objects if found, or null if no payments exist.
     */
    async getAll(): Promise<Payment[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM payments');
            return rows as Payment[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all payments by user ID.
     * @param {number} user_id - The ID of the user.
     * @returns {Promise<Payment[] | null>} A Promise that resolves to an array of Payment objects if found, or null if no payments exist for the user.
     */
    async getAllByUserID(user_id: number): Promise<Payment[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM payments WHERE user_id = ?', [user_id]);
            return rows as Payment[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Creates a new payment.
     * @param {Payment} payment - The Payment object to create.
     * @returns {Promise<void>} A Promise that resolves when the payment is created successfully.
     */
    async create(payment: Payment): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            await pool.query<OkPacket>(
                'INSERT INTO payments (user_id, cardholder_name, card_number, expiry_date, cvv) VALUES (?, ?, ?, ?, ?)',
                [payment.user_id, payment.cardholder_name, payment.card_number, payment.expiry_date, payment.cvv]
            );

            console.log('Payment created successfully', payment.card_number);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Updates an existing payment.
     * @param {Payment} payment - The updated Payment object.
     * @returns {Promise<void>} A Promise that resolves when the payment is updated successfully.
     */
    async update(payment: Payment): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            await pool.query<OkPacket>(
                'UPDATE payments SET cardholder_name = ?, card_number = ?, expiry_date = ?, cvv = ? WHERE user_id = ?',
                [payment.cardholder_name, payment.card_number, payment.expiry_date, payment.cvv, payment.user_id]
            );

            console.log('Payment updated successfully', payment.card_number);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Deletes a payment by CVV.
     * @param {number} cvv - The CVV of the payment to delete.
     * @returns {Promise<void>} A Promise that resolves when the payment is deleted successfully.
     */
    async delete(cvv: number): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            await pool.query<OkPacket>('DELETE FROM payments WHERE cvv = ?', [cvv]);

            console.log('Payment deleted successfully', cvv);
        } catch (error) {
            console.log(error);
        }
    }
}

/**
 * Represents a Payment.
 */
class Payment {
    user_id: number;
    cardholder_name: string;
    card_number: string;
    expiry_date: string;
    cvv: string;

    /**
     * Creates a new Payment.
     * @param {number} user_id - The ID of the user.
     * @param {string} cardholder_name - The name of the cardholder.
     * @param {string} card_number - The card number.
     * @param {string} expiry_date - The expiry date of the card.
     * @param {string} cvv - The CVV of the card.
     */
    constructor(
        user_id: number,
        cardholder_name: string,
        card_number: string,
        expiry_date: string,
        cvv: string
    ) {
        this.user_id = user_id;
        this.cardholder_name = cardholder_name;
        this.card_number = card_number;
        this.expiry_date = expiry_date;
        this.cvv = cvv;
    }

    // Getters and Setters

    /**
     * Gets the user ID of the payment.
     * @returns {number} The user ID.
     */
    getUserID(): number {
        return this.user_id;
    }

    /**
     * Gets the cardholder name of the payment.
     * @returns {string} The cardholder name.
     */
    getCardholderName(): string {
        return this.cardholder_name;
    }

    /**
     * Gets the card number of the payment.
     * @returns {string} The card number.
     */
    getCardNumber(): string {
        return this.card_number;
    }

    /**
     * Gets the expiry date of the payment.
     * @returns {string} The expiry date.
     */
    getExpiryDate(): string {
        return this.expiry_date;
    }

    /**
     * Gets the CVV of the payment.
     * @returns {string} The CVV.
     */
    getCVV(): string {
        return this.cvv;
    }

    /**
     * Sets the user ID of the payment.
     * @param {number} user_id - The user ID to set.
     */
    setUserID(user_id: number): void {
        this.user_id = user_id;
    }

    /**
     * Sets the cardholder name of the payment.
     * @param {string} cardholder_name - The cardholder name to set.
     */
    setCardholderName(cardholder_name: string): void {
        this.cardholder_name = cardholder_name;
    }

    /**
     * Sets the card number of the payment.
     * @param {string} card_number - The card number to set.
     */
    setCardNumber(card_number: string): void {
        this.card_number = card_number;
    }

    /**
     * Sets the expiry date of the payment.
     * @param {string} expiry_date - The expiry date to set.
     */
    setExpiryDate(expiry_date: string): void {
        this.expiry_date = expiry_date;
    }

    /**
     * Sets the CVV of the payment.
     * @param {string} cvv - The CVV to set.
     */
    setCVV(cvv: string): void {
        this.cvv = cvv;
    }

    // Static methods for convenience

    /**
     * Retrieves a payment by CVV.
     * @param {number} cvv - The CVV of the payment.
     * @returns {Promise<Payment | null>} A Promise that resolves to the Payment object if found, or null if not found.
     */
    static async get(cvv: number): Promise<Payment | null> {
        return await new PaymentDAO().get(cvv);
    }

    /**
     * Retrieves all payments.
     * @returns {Promise<Payment[] | null>} A Promise that resolves to an array of Payment objects if found, or null if no payments exist.
     */
    static async getAll(): Promise<Payment[] | null> {
        return await new PaymentDAO().getAll();
    }

    /**
     * Retrieves all payments by user ID.
     * @param {number} user_id - The ID of the user.
     * @returns {Promise<Payment[] | null>} A Promise that resolves to an array of Payment objects if found, or null if no payments exist for the user.
     */
    static async getAllByUserID(user_id: number): Promise<Payment[] | null> {
        return await new PaymentDAO().getAllByUserID(user_id);
    }

    /**
     * Creates a new payment.
     * @param {Payment} card - The Payment object to create.
     * @returns {Promise<void>} A Promise that resolves when the payment is created successfully.
     */
    static async create(card: Payment): Promise<void> {
        await new PaymentDAO().create(card);
    }

    /**
     * Updates an existing payment.
     * @param {Payment} card - The updated Payment object.
     * @returns {Promise<void>} A Promise that resolves when the payment is updated successfully.
     */
    static async update(card: Payment): Promise<void> {
        await new PaymentDAO().update(card);
    }

    /**
     * Deletes a payment by CVV.
     * @param {number} cvv - The CVV of the payment to delete.
     * @returns {Promise<void>} A Promise that resolves when the payment is deleted successfully.
     */
    static async delete(cvv: number): Promise<void> {
        await new PaymentDAO().delete(cvv);
    }
}

export default Payment;
