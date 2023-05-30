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
class ExtraDAO {
    get(booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM extras WHERE booking_id = ?', [booking_id]);
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
                const [rows] = yield pool.query('SELECT * FROM extras');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    create(extras) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO extras (booking_id, mini_valet, full_valet, signature_valet) VALUES (?, ?, ?, ?)', [extras.getBookingID(), extras.getMiniValet(), extras.getFullValet(), extras.getSignatureValet()]);
                console.log('[Server]: extras created, ' + extras.getBookingID());
                return rows.insertId;
            }
            catch (error) {
                console.log('[Server]: error creating extras, ' + error);
            }
            return null;
        });
    }
    update(extras) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                yield pool.query('UPDATE extras SET mini_valet = ?, full_valet = ?, signature_valet = ? WHERE booking_id = ?', [extras.mini_valet, extras.full_valet, extras.signature_valet, extras.booking_id]);
                console.log('[Server]: extras updated, ' + extras.booking_id);
            }
            catch (error) {
                console.log('[Server]: error updating extras, ' + error);
            }
        });
    }
    delete(booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
class Extra {
    constructor(booking_id, mini_valet, full_valet, signature_valet) {
        this.booking_id = booking_id;
        this.mini_valet = mini_valet;
        this.full_valet = full_valet;
        this.signature_valet = signature_valet;
    }
    getBookingID() {
        return this.booking_id;
    }
    getMiniValet() {
        return this.mini_valet;
    }
    getFullValet() {
        return this.full_valet;
    }
    getSignatureValet() {
        return this.signature_valet;
    }
    setBookingID(booking_id) {
        this.booking_id = booking_id;
    }
    setMiniValet(mini_valet) {
        this.mini_valet = mini_valet;
    }
    setFullValet(full_valet) {
        this.full_valet = full_valet;
    }
    setSignatureValet(signature_valet) {
        this.signature_valet = signature_valet;
    }
    static get(booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ExtraDAO().get(booking_id);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new ExtraDAO().getAll();
        });
    }
    static create(extras) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ExtraDAO().create(extras);
        });
    }
    static update(extras) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ExtraDAO().update(extras);
        });
    }
    static delete(booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ExtraDAO().delete(booking_id);
        });
    }
}
exports.default = Extra;
