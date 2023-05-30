"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = exports.init = void 0;
const promise_1 = require("mysql2/promise");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool;
/**
 * Initializes the MySQL connection pool.
 */
const init = () => {
    try {
        pool = (0, promise_1.createPool)({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
            connectionLimit: process.env.MYSQL_CONNECTION_LIMIT ? parseInt(process.env.MYSQL_CONNECTION_LIMIT) : 4,
            waitForConnections: true
        });
        console.log('[server]: Connection pool created');
    }
    catch (error) {
        console.log('[server]: Error creating connection pool');
        console.log(error);
    }
};
exports.init = init;
/**
 * Retrieves the MySQL connection pool.
 * @returns {Pool} The MySQL connection pool.
 */
const getPool = () => {
    return pool;
};
exports.getPool = getPool;
