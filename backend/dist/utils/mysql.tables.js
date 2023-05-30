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
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const MySqlConnector = __importStar(require("./mysql.connector"));
const init = () => {
    // user
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            remember_token VARCHAR(255),
            role VARCHAR(255) NOT NULL,
            telephone VARCHAR(255),
            addressLineOne VARCHAR(255),
            addressLineTwo VARCHAR(255),
            city VARCHAR(255),
            region VARCHAR(255),
            zip VARCHAR(255),
            country VARCHAR(255),
            created_by_user_id INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_by_user_id INT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            suspended TINYINT(1) DEFAULT 0,
            PRIMARY KEY (id),
            UNIQUE KEY (email)
        )`);
    console.log('[Server]: users table created');
    // deleted_users
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS deleted_users (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            notes VARCHAR(255),
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: deleted_users table created');
    // person
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS persons (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            forename VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            given_name VARCHAR(255),
            middle_name VARCHAR(255),
            family_name VARCHAR(255),
            date_of_birth DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    console.log('[Server]: persons table created');
    // business
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS business (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            slogan VARCHAR(255),
            description VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    console.log('[Server]: business table created');
    // emergancy_contact
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS emergancy_contact (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            forename VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            telephone VARCHAR(255) NOT NULL,
            addressLineOne VARCHAR(255),
            addressLineTwo VARCHAR(255),
            city VARCHAR(255),
            region VARCHAR(255),
            zip VARCHAR(255),
            country VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: emergancy_contact table created');
    // login_attempts
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS login_attempts (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            password VARCHAR(255) NOT NULL,
            ip_address VARCHAR(255),
            successful TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: login_attempts table created');
    // roles
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS roles (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY (name)
        )`);
    console.log('[Server]: roles table created');
    // role_users
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS role_users (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            role_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (role_id) REFERENCES roles(id)
        )`);
    console.log('[Server]: role_users table created');
    // vehicles
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS vehicles (
            registration_number VARCHAR(255) NOT NULL,
            user_id INT NOT NULL,
            make VARCHAR(255) NOT NULL,
            model VARCHAR(255) NOT NULL,
            colour VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (registration_number),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    console.log('[Server]: vehicles table created');
    // deleted_vehicles
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS deleted_vehicles (
            id INT NOT NULL AUTO_INCREMENT,
            vehicle_registration_number VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            notes VARCHAR(255),
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: deleted_vehicles table created');
    // extras
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS extras (
            id INT NOT NULL AUTO_INCREMENT,
            booking_id INT NOT NULL,
            mini_valet TINYINT(1) DEFAULT 0,
            full_valet TINYINT(1) DEFAULT 0,
            signature_valet TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: extras table created');
    // discounts
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS discounts (
            id INT NOT NULL AUTO_INCREMENT,
            discount_name VARCHAR(255) NOT NULL,
            discount_code VARCHAR(255) NOT NULL UNIQUE,
            discount_amount DECIMAL(10,2) NOT NULL,
            disabled TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: discounts table created');
    // Booking discounts
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS booking_discounts (
            id INT NOT NULL AUTO_INCREMENT,
            booking_id INT NOT NULL,
            discount_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: booking_discounts table created');
    // bookings
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS bookings (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            vehicle_registration_number VARCHAR(255) NOT NULL,
            extras_id INT,
            discount_id INT,
            space INT NOT NULL,
            date_booked DATETIME NOT NULL,
            booked_from DATETIME NOT NULL,
            booked_until DATETIME NOT NULL,
            cost DECIMAL(10,2) NOT NULL,
            paid TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    console.log('[Server]: bookings table created');
    // deleted_bookings
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS deleted_bookings (
            id INT NOT NULL AUTO_INCREMENT,
            booking_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            notes VARCHAR(255),
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: deleted_bookings table created');
    // payments
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS payments (
            id INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            cardholder_name VARCHAR(255) NOT NULL,
            card_number VARCHAR(255) NOT NULL,
            expiry_date VARCHAR(255) NOT NULL,
            cvv VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    console.log('[Server]: payments table created');
    // prices
    MySqlConnector.getPool().query(`CREATE TABLE IF NOT EXISTS prices (
            id INT NOT NULL AUTO_INCREMENT,
            spaces_available INT NOT NULL,
            price_per_day DECIMAL(10,2) NOT NULL,
            mini_valet DECIMAL(10,2) NOT NULL,
            full_valet DECIMAL(10,2) NOT NULL,
            signature_valet DECIMAL(10,2) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )`);
    console.log('[Server]: prices table created');
};
exports.init = init;
