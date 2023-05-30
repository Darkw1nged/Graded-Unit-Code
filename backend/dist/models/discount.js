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
class DiscountDAO {
    get(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM discounts WHERE discount_code = ?', [code]);
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
                const [rows] = yield pool.query('SELECT * FROM discounts');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    getDiscountID(code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (code == undefined || code == '' || code == null)
                return null;
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT id FROM discounts WHERE discount_code = ?', [code.trim()]);
                return rows[0].id;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    create(discount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO discounts (discount_name, discount_code, discount_amount, disabled) VALUES (?, ?, ?, ?)', [
                    discount.getDiscountName(), discount.getDiscountCode(), discount.getDiscountAmount(), discount.getDisabled()
                ]);
                console.log('[Server]: discount created, ' + discount.getDiscountCode());
            }
            catch (error) {
                console.log('[Server]: user could not created, ' + discount.getDiscountCode() + ', ' + error);
            }
        });
    }
    update(discount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('UPDATE discounts SET discount_name = ?, discount_code = ?, discount_amount = ?, disabled = ? WHERE discount_code = ?', [discount.discount_name, discount.discount_code, discount.discount_amount, discount.disabled, discount.discount_code]);
                console.log('[Server]: discount updated, ' + discount.discount_code);
            }
            catch (error) {
                console.log('[Server]: discount could not updated, ' + discount.discount_code + ', ' + error);
            }
        });
    }
    delete(discount_code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('DELETE FROM discounts WHERE discount_code = ?', [discount_code]);
                console.log('[Server]: discount deleted, ' + discount_code);
            }
            catch (error) {
                console.log('[Server]: discount could not deleted, ' + discount_code + ', ' + error);
            }
        });
    }
}
class Discount {
    constructor(discount_name, discount_code, discount_amount, disabled, created_at, updated_at) {
        this.discount_name = discount_name;
        this.discount_code = discount_code;
        this.discount_amount = discount_amount;
        this.disabled = disabled;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    getDiscountName() {
        return this.discount_name;
    }
    getDiscountCode() {
        return this.discount_code;
    }
    getDiscountAmount() {
        return this.discount_amount;
    }
    getDisabled() {
        return this.disabled;
    }
    getCreatedAt() {
        return this.created_at;
    }
    getUpdatedAt() {
        return this.updated_at;
    }
    setDiscountName(discount_name) {
        this.discount_name = discount_name;
    }
    setDiscountCode(discount_code) {
        this.discount_code = discount_code;
    }
    setDiscountAmount(discount_amount) {
        this.discount_amount = discount_amount;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
    setUpdatedAt(updated_at) {
        this.updated_at = updated_at;
    }
    static get(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscountDAO().get(code);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscountDAO().getAll();
        });
    }
    static getDiscountID(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscountDAO().getDiscountID(code);
        });
    }
    static create(discount) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscountDAO().create(discount);
        });
    }
    static update(discount) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscountDAO().update(discount);
        });
    }
    static delete(discount_code) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscountDAO().delete(discount_code);
        });
    }
}
exports.default = Discount;
