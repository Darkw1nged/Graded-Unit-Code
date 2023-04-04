import jwt from 'jsonwebtoken';
import pool from '../database';

/**
 * A class that handles the sessions of the system.
 * @class
 * @description A class that handles the sessions of the system.
 * @memberof module:backend
 */
export default class Sessions {

    /**
     * @memberof Sessions
     * @description Generates a token for the user.
     * @param email The email of the user.
     * @param expiresIn The time in seconds until the token expires.
     * @returns A token for the user.
     */
    static async generateToken(email: string, expiresIn?: number) {
        const payload = { email };
        const secret = process.env.JWT_SECRET || 'secret';
        const options = { expiresIn: expiresIn || '1h' };
        return jwt.sign(payload, secret, options);
    }

    /**
     * @memberof Sessions
     * @description Verifies a token.
     * @param token The token to verify.
     * @returns True if the token is valid, false otherwise.
     */
    static async verifyToken(token: string) {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Try and query the database
        try {
            // Query the database
            const [rows] = await connection.query('SELECT email FROM sessions WHERE id=?', [token]);

            // If the token is not found
            if (rows.length === 0) {
                return false;
            }

            // If the token is found
            return true;
        } finally {
            // Release the connection
            connection.release();
        }
    }

    /**
     * @memberof Sessions
     * @description Deletes a token.
     * @param token The token to delete.
     * @returns True if the token is valid, false otherwise.
     */
    static async deleteToken(token: string) {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Try and query the database
        try {
            // Query the database
            await connection.query('DELETE FROM sessions WHERE id=?', [token]);
        } finally {
            // Release the connection
            connection.release();
        }
    }

    /**
     * @memberof Sessions
     * @description Gets the email of a user from a token.
     * @param token The token to get the email from.
     * @returns The email of the user.
     * @throws Throws an error if the token is invalid.
     * @throws Throws an error if the token is expired.
     */
    static async getEmail(token: string): Promise<string | null> {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Try and query the database
        try {
            // Query the database
            const [rows] = await connection.query('SELECT email FROM sessions WHERE id=?', [token]);

            // If the token is not found
            if (rows.length === 0) {
                return null;
            }

            // If the token is found
            return rows[0].email;
        } finally {
            // Release the connection
            connection.release();
        }
    }

    /**
     * @memberof Sessions
     * @description Creates a session.
     * @param email The email of the user.
     * @param token The token of the user.
     * @param expiresIn The time in seconds until the token expires.
     */
    static async createSession(email: string, token: string, expiresIn: number): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.query('INSERT INTO sessions (id, email, createdAt, expiresAt) VALUES (?, ?, ?, ?)', [token, email, new Date(), new Date(Date.now() + expiresIn)]);
        } finally {
            connection.release();
        }
    }

    /**
     * @memberof Sessions
     * @description Deletes a session.
     * @param token The token of the session.
     * @returns True if the session was deleted, false otherwise.
     */
    static async deleteSession(token: string): Promise<boolean> {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('DELETE FROM sessions WHERE id="' + token + '"');
            return rows.affectedRows === 1;
        } finally {
            connection.release();
        }
    }

}