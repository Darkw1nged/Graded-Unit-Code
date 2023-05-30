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
class UserDAO {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM users WHERE email = ?', [email]);
                return rows[0];
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    findByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM users WHERE id = ?', [id]);
                return rows[0];
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    getUserID(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (email === undefined)
                    return null;
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT id FROM users WHERE email = ?', [email]);
                return rows.length !== 0 ? rows[0].id : null;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    isDeleted(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const user_id = yield this.getUserID(email);
                const [rows] = yield pool.query('SELECT * FROM deleted_users WHERE user_id = ?', [user_id]);
                return rows.length > 0;
            }
            catch (error) {
                console.log(error);
            }
            return false;
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [user.getEmail(), user.getPassword(), user.getRole()]);
                console.log('[Server]: user created, ' + user.getEmail());
                return rows.insertId;
            }
            catch (error) {
                console.log('[Server]: user could not created, ' + user.getEmail() + ', ' + error);
            }
            return -1;
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT id FROM users WHERE email = ?', [user.email]);
                const id = rows[0].id;
                yield pool.query('UPDATE users SET email = ?, password = ?, remember_token = ?, role = ?, telephone = ?, addressLineOne = ?, addressLineTwo = ?, city = ?, region = ?, zip = ?, country = ?, suspended = ? WHERE id = ?', [user.email, user.password, user.remember_token, user.role, user.telephone, user.addressLineOne, user.addressLineTwo, user.city, user.region, user.zip, user.country, user.suspended, id]);
                console.log('[Server]: user updated, ' + user.email);
                return id;
            }
            catch (error) {
                console.log('[Server]: user could not updated, ' + error);
            }
            return -1;
        });
    }
    delete(email, note) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const user_id = yield this.getUserID(email);
                const [rows] = yield pool.query('INSERT INTO deleted_users (user_id, notes) VALUES(?, ?)', [user_id, note]);
                console.log('[Server]: user deleted, ' + email);
                return rows.insertId;
            }
            catch (error) {
                console.log('[Server]: user could not deleted, ' + email + ', ' + error);
            }
            return -1;
        });
    }
    suspend(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('UPDATE users SET suspended = 1 WHERE email = ?', [email]);
                console.log('[Server]: user suspended, ' + email);
                return rows.insertId;
            }
            catch (error) {
                console.log('[Server]: user could not suspended, ' + email + ', ' + error);
            }
            return -1;
        });
    }
    unsuspend(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('UPDATE users SET suspended = 0 WHERE email = ?', [email]);
                console.log('[Server]: user unsuspended, ' + email);
                return rows.insertId;
            }
            catch (error) {
                console.log('[Server]: user could not unsuspended, ' + email + ', ' + error);
            }
            return -1;
        });
    }
    addLoginAttempt(user_id, password, successful, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO login_attempts (user_id, password, ip_address, successful) VALUES (?, ?, ?, ?)', [user_id, password, ipAddress, successful]);
                console.log('[Server]: login attempt added, ' + user_id);
            }
            catch (error) {
                console.log('[Server]: login attempt could not added, ' + user_id + ', ' + error);
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM users');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
    }
    getUsersBetweenDate(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM users WHERE created_at BETWEEN ? AND ?', [from, to]);
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
    }
    getStaff() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM users WHERE role = "admin" OR role = "manager" OR role = "booking clerk" OR role = "invoice clerk"');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
    }
    getAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM users WHERE role = "admin"');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
    }
}
class User {
    constructor(email, password, role, remember_token, telephone, addressLineOne, addressLineTwo, city, region, zip, country, created_by_user_id, created_at, updated_by_user_id, updated_at, suspended) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.remember_token = remember_token;
        this.telephone = telephone;
        this.addressLineOne = addressLineOne;
        this.addressLineTwo = addressLineTwo;
        this.city = city;
        this.region = region;
        this.zip = zip;
        this.country = country;
        this.created_by_user_id = created_by_user_id;
        this.created_at = created_at;
        this.updated_by_user_id = updated_by_user_id;
        this.updated_at = updated_at;
        this.suspended = suspended;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getRememberToken() {
        return this.remember_token;
    }
    getRole() {
        return this.role;
    }
    getTelephone() {
        return this.telephone;
    }
    getAddressLineOne() {
        return this.addressLineOne;
    }
    getAddressLineTwo() {
        return this.addressLineTwo;
    }
    getCity() {
        return this.city;
    }
    getRegion() {
        return this.region;
    }
    getZip() {
        return this.zip;
    }
    getCountry() {
        return this.country;
    }
    getCreatedByUserId() {
        return this.created_by_user_id;
    }
    getCreatedAt() {
        return this.created_at;
    }
    getUpdatedByUserId() {
        return this.updated_by_user_id;
    }
    getUpdatedAt() {
        return this.updated_at;
    }
    getSuspended() {
        return this.suspended;
    }
    setEmail(email) {
        this.email = email;
    }
    setPassword(password) {
        this.password = password;
    }
    setRememberToken(remember_token) {
        this.remember_token = remember_token;
    }
    setRole(role) {
        this.role = role;
    }
    setTelephone(telephone) {
        this.telephone = telephone;
    }
    setAddressLineOne(addressLineOne) {
        this.addressLineOne = addressLineOne;
    }
    setAddressLineTwo(addressLineTwo) {
        this.addressLineTwo = addressLineTwo;
    }
    setCity(city) {
        this.city = city;
    }
    setRegion(region) {
        this.region = region;
    }
    setZip(zip) {
        this.zip = zip;
    }
    setCountry(country) {
        this.country = country;
    }
    setCreatedByUserId(created_by_user_id) {
        this.created_by_user_id = created_by_user_id;
    }
    setUpdatedByUserId(updated_by_user_id) {
        this.updated_by_user_id = updated_by_user_id;
    }
    setSuspended(suspended) {
        this.suspended = suspended;
    }
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().getUsers();
        });
    }
    static getUsersBetweenDate(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().getUsersBetweenDate(from, to);
        });
    }
    static getStaff() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().getStaff();
        });
    }
    static getAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().getAdmins();
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().findByEmail(email);
        });
    }
    static findByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().findByID(id);
        });
    }
    static isDeleted(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().isDeleted(email);
        });
    }
    static getUserID(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().getUserID(email);
        });
    }
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().create(user);
        });
    }
    static update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().update(user);
        });
    }
    static delete(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().delete(email);
        });
    }
    static suspend(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().suspend(email);
        });
    }
    static unsuspend(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new UserDAO().unsuspend(email);
        });
    }
    static addLoginAttempt(user_id, password, successful, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new UserDAO().addLoginAttempt(user_id, password, successful, ipAddress);
        });
    }
}
exports.default = User;
