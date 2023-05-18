import { getConnection } from '../database';
import { PoolConnection } from 'mysql2/promise';

export class PaymenteDAO {

    async createPayment(email: string, payment: Payment): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.execute(`
                INSERT INTO payments (email, cardholder_name, card_number, card_expiry, cvv)
                VALUES (?, ?, ?, ?, ?)
            `, [email, payment.getCardholderName(), payment.getCardNumber(), payment.getCardExpiry(), payment.getCVV()]);
        } catch (error) {
            console.log('Error creating payment', error);
        } finally {
            connection.release();
        }
    }

    async getPayments(email: string): Promise<Payment[] | undefined> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.execute(`
                SELECT * FROM payments WHERE email = ?
            `, [email]);

            return rows as Payment[];
        } catch (error) {
            console.log('Error getting payments', error);
        } finally {
            connection.release();
        }
    }

    async removePayment(email: string, payment: Payment): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.execute(`
                DELETE FROM payments WHERE email = ? AND card_number = ?
            `, [email, payment.getCardNumber()]);
        } catch (error) {
            console.log('Error removing payment', error);
        } finally {
            connection.release();
        }
    }        

}

export default class Payment {

    cardholder_name: string;
    card_number: string;
    card_expiry: string;
    cvv: string;
    
    constructor(cardholder_name: string, card_number: string, card_expiry: string, cvv: string) {
        this.cardholder_name = cardholder_name;
        this.card_number = card_number;
        this.card_expiry = card_expiry;
        this.cvv = cvv;
    }

    getCardholderName(): string {
        return this.cardholder_name;
    }

    setCardholderName(cardholder_name: string) {
        this.cardholder_name = cardholder_name;
    }

    getCardNumber(): string {
        return this.card_number;
    }

    setCardNumber(card_number: string) {
        this.card_number = card_number;
    }

    getCardExpiry(): string {
        return this.card_expiry;
    }

    setCardExpiry(card_expiry: string) {
        this.card_expiry = card_expiry;
    }

    getCVV(): string {
        return this.cvv;
    }

    setCVV(cvv: string) {
        this.cvv = cvv;
    }

    async create(email: string) {
        const paymentDAO = new PaymenteDAO();
        await paymentDAO.createPayment(email, this);
    }

    static async getPayments(email: string): Promise<Payment[] | undefined> {
        const paymentDAO = new PaymenteDAO();
        return await paymentDAO.getPayments(email);
    }

    async delete(email: string) {
        const paymentDAO = new PaymenteDAO();
        await paymentDAO.removePayment(email, this);
    }



}