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
Object.defineProperty(exports, "__esModule", { value: true });
const MySqlConnector = __importStar(require("../utils/mysql.connector"));
class PaymentDAO {
    get(cvv) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM payments WHERE cvv = ?', [cvv]);
                return rows[0];
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM payments');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    getAllByUserID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM payments WHERE user_id = ?', [user_id]);
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    create(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                yield pool.query('INSERT INTO payments (user_id, cardholder_name, card_number, expiry_date, cvv) VALUES (?, ?, ?, ?, ?)', [payment.user_id, payment.cardholder_name, payment.card_number, payment.expiry_date, payment.cvv]);
                console.log('Payment created successfully', payment.card_number);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    update(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                yield pool.query('UPDATE payments SET cardholder_name = ?, card_number = ?, expiry_date = ?, cvv = ? WHERE user_id = ?', [payment.cardholder_name, payment.card_number, payment.expiry_date, payment.cvv, payment.user_id]);
                console.log('Payment updated successfully', payment.card_number);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    delete(cvv) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                yield pool.query('DELETE FROM payments WHERE cvv = ?', [cvv]);
                console.log('Payment deleted successfully', cvv);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
class Payment {
    constructor(user_id, cardholder_name, card_number, expiry_date, cvv) {
        this.user_id = user_id;
        this.cardholder_name = cardholder_name;
        this.card_number = card_number;
        this.expiry_date = expiry_date;
        this.cvv = cvv;
    }
    getUserID() {
        return this.user_id;
    }
    getCardholderName() {
        return this.cardholder_name;
    }
    getCardNumber() {
        return this.card_number;
    }
    getExpiryDate() {
        return this.expiry_date;
    }
    getCVV() {
        return this.cvv;
    }
    setUserID(user_id) {
        this.user_id = user_id;
    }
    setCardholderName(cardholder_name) {
        this.cardholder_name = cardholder_name;
    }
    setCardNumber(card_number) {
        this.card_number = card_number;
    }
    setExpiryDate(expiry_date) {
        this.expiry_date = expiry_date;
    }
    setCVV(cvv) {
        this.cvv = cvv;
    }
    static get(cvv) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new PaymentDAO().get(cvv);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new PaymentDAO().getAll();
        });
    }
    static getAllByUserID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new PaymentDAO().getAllByUserID(user_id);
        });
    }
    static create(card) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new PaymentDAO().create(card);
        });
    }
    static update(card) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new PaymentDAO().update(card);
        });
    }
    static delete(cvv) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new PaymentDAO().delete(cvv);
        });
    }
}
exports.default = Payment;
