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
const payment_1 = __importDefault(require("../models/payment"));
const user_1 = __importDefault(require("../models/user"));
class PaymentService {
    /**
     * Retrieves all cards.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getCards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cards = yield payment_1.default.getAll();
                res.status(200).json(cards);
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    /**
     * Retrieves cards for a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getUserCards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const cards = yield payment_1.default.getAllByUserID(user_id);
                res.status(200).json(cards);
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Adds a new card for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static addCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { card, email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                // Validate card
                const payment = yield payment_1.default.get(card.cvv);
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
                if (year === parseInt(currentYear) &&
                    month < new Date().getMonth() + 1 ||
                    month === new Date().getMonth()) {
                    res.status(400).json({ message: 'Invalid expiry date' });
                    return;
                }
                const newCard = new payment_1.default(user_id, card.cardholder_name, card.card_number, card.expiry_date, card.cvv);
                yield payment_1.default.create(newCard);
                const cards = yield payment_1.default.getAllByUserID(user_id);
                res.status(200).json({
                    message: 'Card added successfully',
                    cards,
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Updates an existing card for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static updateCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { card, email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const newCard = new payment_1.default(user_id, card.cardholder_name, card.card_number, card.expiry_date, card.cvv);
                yield payment_1.default.update(newCard);
                const cards = yield payment_1.default.getAllByUserID(user_id);
                res.status(200).json({
                    message: 'Card updated successfully',
                    cards,
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Deletes a card for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static deleteCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { card, email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                yield payment_1.default.delete(card.cvv);
                const cards = yield payment_1.default.getAllByUserID(user_id);
                res.status(200).json({
                    message: 'Card deleted successfully',
                    cards,
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Finds a card by CVV.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static findCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cvv } = req.body;
            try {
                const card = yield payment_1.default.get(cvv);
                if (!card) {
                    res.status(404).json({ message: 'Card not found' });
                    return;
                }
                res.status(200).json({ card });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = PaymentService;
