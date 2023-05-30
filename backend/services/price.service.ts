import { Request, Response } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import * as MySqlConnector from '../utils/mysql.connector';
import User from '../models/user';

/**
 * Service for retrieving and updating prices.
 */
class PriceService {

    /**
     * Retrieves the price information.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getPrice(req: Request, res: Response) {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM prices');

            res.json({
                price_per_day: rows[0].price_per_day,
                spaces_available: rows[0].spaces_available,
                mini_valet: rows[0].mini_valet,
                full_valet: rows[0].full_valet,
                signature_valet: rows[0].signature_valet,
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    }

    /**
     * Updates the price information.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async updatePrice(req: Request, res: Response) {
        const { price_per_day, spaces_available, mini_valet, full_valet, signature_valet, email } = req.body;
        try {
            if (!email) {
                res.status(400).json({ message: 'User not found.' });
                return;
            }

            const user = await User.findByEmail(email);
            if (!user) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            if (user.role !== 'manager') {
                res.status(403).json({ message: 'User is not a manager.' });
                return;
            }

            let price = parseInt(price_per_day);
            let spaces = parseInt(spaces_available);
            let miniValet = parseInt(mini_valet);
            let fullValet = parseInt(full_valet);
            let signatureValet = parseInt(signature_valet);

            if (isNaN(price) || isNaN(spaces) || isNaN(miniValet) || isNaN(fullValet) || isNaN(signatureValet)) {
                res.status(400).json({ message: 'Price, spaces, and valet prices must be numbers' });
                return;
            }

            const pool = await MySqlConnector.getPool();
            await pool.query<OkPacket>(
                'UPDATE prices SET price_per_day = ?, spaces_available = ?, mini_valet = ?, full_valet = ?, signature_valet = ? WHERE id = 1',
                [price, spaces, miniValet, fullValet, signatureValet]
            );

            res.json({
                message: 'Price updated successfully',
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Internal server error',
            });
        }
    }

}

export default PriceService;