import { Request, Response } from 'express';
import Payment from '../models/payment';
import User from '../models/user';

class PaymentService {

    /**
     * Retrieves all cards.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getCards(req: Request, res: Response) {
        try {
            const cards = await Payment.getAll();
            res.status(200).json(cards);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    /**
     * Retrieves cards for a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getUserCards(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const cards = await Payment.getAllByUserID(user_id);
            res.status(200).json(cards);
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Adds a new card for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async addCard(req: Request, res: Response) {
        const { card, email } = req.body;
        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Validate card
            const payment = await Payment.get(card.cvv);
            if (payment) {
                res.status(400).json({ message: 'Card already exists' });
                return;
            }

            if (card.card_number.length < 16 || card.card_number.length > 19) {
                res.status(400).json({ message: 'Invalid card number' });
                return;
            }

            if (card.expiry_date.length !== 5) {
                res.status(400).json({ message: 'Invalid expiry date' });
                return;
            }

            if (card.cvv.length !== 3) {
                res.status(400).json({ message: 'Invalid CVV' });
                return;
            }

            // Check if card expiry date is valid format should be MM/YY
            const expiryDate = card.expiry_date.split('/');
            const month = parseInt(expiryDate[0]);
            const year = parseInt(expiryDate[1]);
            if (month < 1 || month > 12) {
                res.status(400).json({ message: 'Invalid expiry date' });
                return;
            }
            const currentYear = new Date().getFullYear().toString().substring(2, 4);
            if (year < parseInt(currentYear) || year > 99) {
                res.status(400).json({ message: 'Invalid expiry date' });
                return;
            }
            if (
                year === parseInt(currentYear) &&
                month < new Date().getMonth() + 1 ||
                month === new Date().getMonth()
            ) {
                res.status(400).json({ message: 'Invalid expiry date' });
                return;
            }

            const newCard = new Payment(
                user_id,
                card.cardholder_name,
                card.card_number,
                card.expiry_date,
                card.cvv
            );
            await Payment.create(newCard);
            const cards = await Payment.getAllByUserID(user_id);
            res.status(200).json({
                message: 'Card added successfully',
                cards,
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Updates an existing card for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async updateCard(req: Request, res: Response) {
        const { card, email } = req.body;
        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const newCard = new Payment(
                user_id,
                card.cardholder_name,
                card.card_number,
                card.expiry_date,
                card.cvv
            );
            await Payment.update(newCard);
            const cards = await Payment.getAllByUserID(user_id);
            res.status(200).json({
                message: 'Card updated successfully',
                cards,
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Deletes a card for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async deleteCard(req: Request, res: Response) {
        const { card, email } = req.body;
        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            await Payment.delete(card.cvv);
            const cards = await Payment.getAllByUserID(user_id);
            res.status(200).json({
                message: 'Card deleted successfully',
                cards,
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Finds a card by CVV.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async findCard(req: Request, res: Response) {
        const { cvv } = req.body;
        try {
            const card = await Payment.get(cvv);
            if (!card) {
                res.status(404).json({ message: 'Card not found' });
                return;
            }
            res.status(200).json({ card });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default PaymentService;