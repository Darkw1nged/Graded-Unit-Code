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
class EmergancyContactDAO {
    get(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    create(emergancyContact) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO emergancy_contacts (user_id, forename, surname, telephone, address_line_one, address_line_two, city, region, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [emergancyContact.userId, emergancyContact.forename, emergancyContact.surname, emergancyContact.telephone, emergancyContact.addressLineOne, emergancyContact.addressLineTwo, emergancyContact.city, emergancyContact.region, emergancyContact.zip, emergancyContact.country]);
                console.log('[Server]: emergancy contact created, ' + emergancyContact.forename + ' ' + emergancyContact.surname);
                return rows.insertId;
            }
            catch (error) {
                console.log('[Server]: emergancy contact could not created, ' + error);
            }
            return null;
        });
    }
    update(emergancyContact, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT id FROM users WHERE email = ?', [email]);
                const id = rows[0].id;
                yield pool.query('UPDATE emergancy_contacts SET forename = ?, surname = ?, telephone = ?, address_line_one = ?, address_line_two = ?, city = ?, region = ?, zip = ?, country = ? WHERE user_id = ?', [emergancyContact.forename, emergancyContact.surname, emergancyContact.telephone, emergancyContact.addressLineOne, emergancyContact.addressLineTwo, emergancyContact.city, emergancyContact.region, emergancyContact.zip, emergancyContact.country, id]);
                console.log('[Server]: emergancy contact updated, ' + emergancyContact.forename + ' ' + emergancyContact.surname);
                return id;
            }
            catch (error) {
                console.log('[Server]: emergancy contac could not updated, ' + error);
            }
            return null;
        });
    }
    delete(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                yield pool.query('DELETE FROM emergancy_contacts WHERE user_id = ?', [user_id]);
            }
            catch (error) {
                console.log('[Server]: emergancy contact could not deleted, ' + error);
            }
            return null;
        });
    }
}
class EmergancyContact {
    constructor(userId, forename, surname, telephone, addressLineOne, addressLineTwo, city, region, zip, country, created_at, updated_at) {
        this.userId = userId;
        this.forename = forename;
        this.surname = surname;
        this.telephone = telephone;
        this.addressLineOne = addressLineOne;
        this.addressLineTwo = addressLineTwo;
        this.city = city;
        this.region = region;
        this.zip = zip;
        this.country = country;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    getUserId() {
        return this.userId;
    }
    getForename() {
        return this.forename;
    }
    getSurname() {
        return this.surname;
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
    getCreatedAt() {
        return this.created_at;
    }
    getUpdatedAt() {
        return this.updated_at;
    }
    setUserId(userId) {
        this.userId = userId;
    }
    setForename(forename) {
        this.forename = forename;
    }
    setSurname(surname) {
        this.surname = surname;
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
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
    setUpdatedAt(updated_at) {
        this.updated_at = updated_at;
    }
    static create(emergancyContact) {
        return __awaiter(this, void 0, void 0, function* () {
            return new EmergancyContactDAO().create(emergancyContact);
        });
    }
    static update(emergancyContact, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new EmergancyContactDAO().update(emergancyContact, email);
        });
    }
    static delete(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new EmergancyContactDAO().delete(userID);
        });
    }
}
exports.default = EmergancyContact;
