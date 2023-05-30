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
class PersonDAO {
    getByUserID(UserID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM persons WHERE user_id = ?', [UserID]);
                return rows[0];
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    create(person) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO persons (user_id, forename, surname) VALUES (?, ?, ?)', [person.UserID, person.forename, person.surname]);
                return rows.insertId;
            }
            catch (error) {
                console.log(error);
            }
            return -1;
        });
    }
    update(person, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT id FROM users WHERE email = ?', [email]);
                const id = rows[0].id;
                yield pool.query('UPDATE persons SET forename = ?, surname = ?, middle_name = ?, family_name = ?, date_of_birth = ? WHERE user_id = ?', [person.forename, person.surname, person.middle_name, person.family_name, person.date_of_birth, id]);
                return id;
            }
            catch (error) {
                console.log(error);
            }
            return -1;
        });
    }
    getPersons() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM persons');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
    }
}
class Person {
    constructor(UserID, forename, surname, middle_name, family_name, date_of_birth) {
        this.UserID = UserID;
        this.forename = forename;
        this.surname = surname;
        this.middle_name = middle_name;
        this.family_name = family_name;
        this.date_of_birth = date_of_birth;
    }
    getUserID() {
        return this.UserID;
    }
    getForename() {
        return this.forename;
    }
    getSurname() {
        return this.surname;
    }
    getMiddleName() {
        return this.middle_name;
    }
    getFamilyName() {
        return this.family_name;
    }
    getDateOfBirth() {
        return this.date_of_birth;
    }
    setUserID(UserID) {
        this.UserID = UserID;
    }
    setForename(forename) {
        this.forename = forename;
    }
    setSurname(surname) {
        this.surname = surname;
    }
    setMiddleName(middle_name) {
        this.middle_name = middle_name;
    }
    setFamilyName(family_name) {
        this.family_name = family_name;
    }
    setDateOfBirth(date_of_birth) {
        this.date_of_birth = date_of_birth;
    }
    static getByUserID(UserID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new PersonDAO().getByUserID(UserID);
        });
    }
    static getPersons() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new PersonDAO().getPersons();
        });
    }
    static create(person) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new PersonDAO().create(person);
        });
    }
    static update(person, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new PersonDAO().update(person, email);
        });
    }
}
exports.default = Person;
