"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const MySqlConnector = __importStar(require("../utils/mysql.connector"));
const user_1 = __importDefault(require("../models/user"));
/**
 * Service for retrieving and updating prices.
 */
class PriceService {
    /**
     * Retrieves the price information.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM prices');
                res.json({
                    price_per_day: rows[0].price_per_day,
                    spaces_available: rows[0].spaces_available,
                    mini_valet: rows[0].mini_valet,
                    full_valet: rows[0].full_valet,
                    signature_valet: rows[0].signature_valet,
                });
            }
            catch (err) {
                res.status(500).json({
                    message: 'Internal server error',
                });
            }
        });
    }
    /**
     * Updates the price information.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static updatePrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { price_per_day, spaces_available, mini_valet, full_valet, signature_valet, email } = req.body;
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
                let price = parseInt(price_per_day);
                let spaces = parseInt(spaces_available);
                let miniValet = parseInt(mini_valet);
                let fullValet = parseInt(full_valet);
                let signatureValet = parseInt(signature_valet);
                if (isNaN(price) || isNaN(spaces) || isNaN(miniValet) || isNaN(fullValet) || isNaN(signatureValet)) {
                    res.status(400).json({ message: 'Price, spaces, and valet prices must be numbers' });
                    return;
                }
                const pool = yield MySqlConnector.getPool();
                yield pool.query('UPDATE prices SET price_per_day = ?, spaces_available = ?, mini_valet = ?, full_valet = ?, signature_valet = ? WHERE id = 1', [price, spaces, miniValet, fullValet, signatureValet]);
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
        });
    }
}
exports.default = PriceService;
