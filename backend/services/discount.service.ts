import { Request, Response } from 'express';
import Discount from '../models/discount';
import User from '../models/user';

/**
 * DiscountService handles discount-related operations.
 */
class DiscountService {
    /**
     * Retrieves all discounts.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getDiscounts(req: Request, res: Response) {
        try {
            const discounts = await Discount.getAll();
            if (!discounts) {
                res.status(404).json({ message: 'Discounts not found' });
                return;
            }
            res.status(200).json({ discounts });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Adds a new discount.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async addDiscount(req: Request, res: Response) {
        const { discount, email } = req.body;
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

            const discountExists = await Discount.get(discount.discount_code);
            if (discountExists) {
                res.status(409).json({ message: 'Discount already exists' });
                return;
            }

            let discountAmount = parseInt(discount.discount_amount);
            if (isNaN(discountAmount)) {
                res.status(400).json({ message: 'Discount amount must be a number' });
                return;
            }
            if (discountAmount < 0 || discountAmount > 100) {
                res.status(400).json({ message: 'Discount amount must be between 0 and 100' });
                return;
            }

            const result = new Discount(discount.discount_name, discount.discount_code, discountAmount, discount.disabled);
            await Discount.create(result);

            const discounts = await Discount.getAll();
            res.status(200).json({
                message: 'Discount added',
                discounts,
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Updates an existing discount.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async updateDiscount(req: Request, res: Response) {
        const { discount, email } = req.body;
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

            const discountExists = await Discount.get(discount.discount_code);
            if (!discountExists) {
                res.status(404).json({ message: 'Discount not found' });
                return;
            }

            let discountAmount = parseInt(discount.discount_amount);
            if (isNaN(discountAmount)) {
                res.status(400).json({ message: 'Discount amount must be a number' });
                return;
            }
            if (discountAmount < 0 || discountAmount > 100) {
                res.status(400).json({ message: 'Discount amount must be between 0 and 100' });
                return;
            }
            const result = new Discount(discount.discount_name, discount.discount_code, discountAmount, discount.disabled);
            await Discount.update(result);
            res.status(200).json({ message: 'Discount updated' });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Deletes a discount.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async deleteDiscount(req: Request, res: Response) {
        const { discount_code } = req.body;
        try {
            const discountExists = await Discount.get(discount_code);
            if (!discountExists) {
                res.status(404).json({ message: 'Discount not found' });
                return;
            }

            await Discount.delete(discount_code);
            const discounts = await Discount.getAll();
            res.status(200).json({
                message: 'Discount deleted',
                discounts,
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Finds a discount by discount code.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async findDiscount(req: Request, res: Response) {
        const { discount_code } = req.body;
        try {
            const discount = await Discount.get(discount_code);
            if (!discount) {
                res.status(404).json({ message: 'Discount not found' });
                return;
            }
            res.status(200).json({ discount });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default DiscountService;