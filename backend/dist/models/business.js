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
/**
 * Represents a Data Access Object (DAO) for the Business entity.
 */
class BusinessDAO {
    /**
     * Retrieves a Business object by user ID.
     * @param {number} user_id - The ID of the user.
     * @returns {Promise<Business | null>} A promise that resolves to the retrieved Business object, or null if not found.
     */
    getByUserID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM business WHERE user_id = ?', [user_id]);
                return rows[0];
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    /**
     * Creates a new Business object.
     * @param {Business} business - The Business object to create.
     * @returns {Promise<number>} A promise that resolves to the ID of the newly created Business object.
     */
    create(business) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO business (user_id, name, slogan, description) VALUES (?, ?, ?, ?)', [business.user_id, business.name, business.slogan, business.description]);
                return rows.insertId;
            }
            catch (error) {
                console.log(error);
            }
            return -1;
        });
    }
    /**
     * Updates an existing Business object.
     * @param {Business} business - The Business object to update.
     * @param {string} email - The email associated with the user.
     * @returns {Promise<number>} A promise that resolves to the ID of the updated Business object.
     */
    update(business, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT id FROM users WHERE email = ?', [email]);
                const id = rows[0].id;
                yield pool.query('UPDATE business SET name = ?, slogan = ?, description = ? WHERE user_id = ?', [business.name, business.slogan, business.description, business.user_id]);
                return id;
            }
            catch (error) {
                console.log(error);
            }
            return -1;
        });
    }
    /**
     * Retrieves all Business objects.
     * @returns {Promise<Business[]>} A promise that resolves to an array of Business objects.
     */
    getBusiness() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows, fields] = yield pool.query('SELECT * FROM business');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return [];
        });
    }
}
/**
 * Represents a business entity.
 */
class Business {
    /**
     * Creates a new instance of the Business class.
     * @param {number} user_id - The user ID associated with the business.
     * @param {string} name - The name of the business.
     * @param {string} [slogan] - The slogan of the business (optional).
     * @param {string} [description] - The description of the business (optional).
     */
    constructor(user_id, name, slogan, description) {
        this.user_id = user_id;
        this.name = name;
        this.slogan = slogan;
        this.description = description;
    }
    /**
     * Gets the user ID associated with the business.
     * @returns {number} The user ID.
     */
    getUserID() {
        return this.user_id;
    }
    /**
     * Gets the name of the business.
     * @returns {string} The name.
     */
    getName() {
        return this.name;
    }
    /**
     * Gets the slogan of the business, if available.
     * @returns {string | undefined} The slogan or undefined if not provided.
     */
    getSlogan() {
        return this.slogan;
    }
    /**
     * Gets the description of the business, if available.
     * @returns {string | undefined} The description or undefined if not provided.
     */
    getDescription() {
        return this.description;
    }
    /**
     * Sets the user ID associated with the business.
     * @param {number} user_id - The user ID to set.
     */
    setUserID(user_id) {
        this.user_id = user_id;
    }
    /**
     * Sets the name of the business.
     * @param {string} name - The name to set.
     */
    setName(name) {
        this.name = name;
    }
    /**
     * Sets the slogan of the business.
     * @param {string} slogan - The slogan to set.
     */
    setSlogan(slogan) {
        this.slogan = slogan;
    }
    /**
     * Sets the description of the business.
     * @param {string} description - The description to set.
     */
    setDescription(description) {
        this.description = description;
    }
    /**
     * Retrieves a business by its user ID.
     * @param {number} user_id - The user ID to search for.
     * @returns {Promise<Business | null>} A promise that resolves to the Business instance, or null if not found.
     */
    static getByUserID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new BusinessDAO().getByUserID(user_id);
        });
    }
    /**
     * Retrieves all businesses.
     * @returns {Promise<Business[]>} A promise that resolves to an array of Business instances.
     */
    static getBusiness() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new BusinessDAO().getBusiness();
        });
    }
    /**
     * Creates a new business.
     * @param {Business} business - The business to create.
     * @returns {Promise<number>} A promise that resolves to the ID of the created business.
     */
    static create(business) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new BusinessDAO().create(business);
        });
    }
    /**
     * Updates an existing business.
     * @param {Business} business - The updated business object.
     * @param {string} email - The email associated with the business.
     * @returns {Promise<number>} A promise that resolves to the number of updated rows.
     */
    static update(business, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new BusinessDAO().update(business, email);
        });
    }
}
exports.default = Business;
