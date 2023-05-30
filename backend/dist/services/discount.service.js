"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discount_1 = __importDefault(require("../models/discount"));
const user_1 = __importDefault(require("../models/user"));
/**
 * DiscountService handles discount-related operations.
 */
class DiscountService {
    /**
     * Retrieves all discounts.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getDiscounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const discounts = yield discount_1.default.getAll();
                if (!discounts) {
                    res.status(404).json({ message: 'Discounts not found' });
                    return;
                }
                res.status(200).json({ discounts });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Adds a new discount.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static addDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { discount, email } = req.body;
            try {
                if (!email) {
                    res.status(400).json({ message: 'User not found.' });
                    return;
                }
                const user = yield user_1.default.findByEmail(email);
                if (!user) {
                    res.status(404).json({ message: 'User not found.' });
                    return;
                }
                if (user.role !== 'manager') {
                    res.status(403).json({ message: 'User is not a manager.' });
                    return;
                }
                const discountExists = yield discount_1.default.get(discount.discount_code);
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
                const result = new discount_1.default(discount.discount_name, discount.discount_code, discountAmount, discount.disabled);
                yield discount_1.default.create(result);
                const discounts = yield discount_1.default.getAll();
                res.status(200).json({
                    message: 'Discount added',
                    discounts,
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Updates an existing discount.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static updateDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { discount, email } = req.body;
            try {
                if (!email) {
                    res.status(400).json({ message: 'User not found.' });
                    return;
                }
                const user = yield user_1.default.findByEmail(email);
                if (!user) {
                    res.status(404).json({ message: 'User not found.' });
                    return;
                }
                if (user.role !== 'manager') {
                    res.status(403).json({ message: 'User is not a manager.' });
                    return;
                }
                const discountExists = yield discount_1.default.get(discount.discount_code);
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
                const result = new discount_1.default(discount.discount_name, discount.discount_code, discountAmount, discount.disabled);
                yield discount_1.default.update(result);
                res.status(200).json({ message: 'Discount updated' });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Deletes a discount.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static deleteDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { discount_code } = req.body;
            try {
                const discountExists = yield discount_1.default.get(discount_code);
                if (!discountExists) {
                    res.status(404).json({ message: 'Discount not found' });
                    return;
                }
                yield discount_1.default.delete(discount_code);
                const discounts = yield discount_1.default.getAll();
                res.status(200).json({
                    message: 'Discount deleted',
                    discounts,
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Finds a discount by discount code.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static findDiscount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { discount_code } = req.body;
            try {
                const discount = yield discount_1.default.get(discount_code);
                if (!discount) {
                    res.status(404).json({ message: 'Discount not found' });
                    return;
                }
                res.status(200).json({ discount });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = DiscountService;
